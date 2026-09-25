// game_core.js - Core Physics, Terrain, and Game Logic for MBG: Road To School
// Pure ES module for testing and browser integration.

export const BIOMES = {
  PANTURA: { id: 1, name: 'Pesisir Jalur Pantura', start: 0, end: 1200 },
  SAWAH: { id: 2, name: 'Pesawahan Terasering Hijau', start: 1200, end: 2800 },
  GUNUNG: { id: 3, name: 'Tanjakan Gunung & Kebun Teh', start: 2800, end: 4200 },
  SEKOLAH: { id: 4, name: 'Suburb Cirebon & Finis SD SMP SMA Puspa Bangsa', start: 4200, end: 4600 }
};

export const PHYSICS_CONSTANTS = {
  GRAVITY: 980,             // px/s^2 downward
  K_SPRING: 1800,           // Specified in PRD: K_spring = 1800
  K_DAMPER: 48,             // Specified in PRD: K_damper = 48
  MASS: 1400,               // Specified in PRD: Mass = 1400
  ROLLOVER_ANGLE: 1.8326,    // 105 degrees in radians
  ROLLOVER_GRACE_TIME: 0.45,// seconds
  MAX_PENETRATION_CLAMP: 8, // px before clamping
  LOG_IMPULSE_VY: -140,      // px/s vertical impulse when hitting log
  WATER_SLIP_TRACTION: 0.85,
  MUD_SLIP_TRACTION: 0.82,
  MUD_DRAG_RATE: 2.5,        // 1/s chassis-transmitted rolling drag; leaves enough pace for skilled completion
  METER_SCALE: 20,          // 20 px = 1 meter
  MAX_FORWARD_SPEED: 550,   // px/s = 99 km/h on HUD; holds momentum without 162 km/h arcade spikes
  MAX_REVERSE_SPEED: 220,   // px/s; reverse is slower than forward drive
  MAX_ANGULAR_SPEED: 3.0,   // rad/s; preserves controllable wheelies and airborne recovery
  ANGULAR_DAMPING: 3.5,     // per second; settles pitch after releasing the controls
  AIR_PITCH_TORQUE: 4.0,    // rad/s^2; air control is deliberate rather than instant flips
  GROUND_GAS_PITCH_TORQUE: 260,
  GROUND_BRAKE_PITCH_TORQUE: 120, // sequential high-speed test: lifts rear tire while staying within recoverable pitch
  THROTTLE_RAMP_UP: 6.0,    // per second; softens launch and wheelie onset
  THROTTLE_RAMP_DOWN: 8.0,  // per second; releases engine torque promptly
  REVERSE_RAMP_UP: 4.0      // per second; prevents an abrupt reverse snap
};

export class TerrainSystem {
  constructor(totalMeters = 4600) {
    this.totalMeters = totalMeters;
    this.totalPx = totalMeters * PHYSICS_CONSTANTS.METER_SCALE;
    this.finishLineMeters = 4500;
    this.finishLinePx = this.finishLineMeters * PHYSICS_CONSTANTS.METER_SCALE;

    // Hazards and collectibles caches
    this.puddles = []; // Pantura seawater rob puddles [startM, endM]
    this.mudPits = []; // Sawah mud trenches [startM, endM]
    this.logs = [];    // Mountain wooden logs [meterX, radius]
    this.speedBumps = []; // Suburb speed bumps [meterX]
    this.launchRamps = [];
    this.fuelCans = []; // [meterX, collected]
    this.coins = [];    // [meterX, collected]

    this.initHazardsAndItems();
  }

  initHazardsAndItems() {
    // Biome 1: Pantura Water puddles (Rob)
    this.puddles = [
      { start: 250, end: 320 },
      { start: 600, end: 680 },
      { start: 950, end: 1040 }
    ];

    // Biome 2: Sawah Mud pits
    this.mudPits = [
      { start: 1400, end: 1480 },
      { start: 1850, end: 1940 },
      { start: 2350, end: 2430 }
    ];

    // Biome 3: Mountain Wooden Logs
    this.logs = [
      { x: 2950, radius: 12 },
      { x: 3350, radius: 14 },
      { x: 3700, radius: 14 },
      { x: 4050, radius: 15 }
    ];

    // Biome 4: Suburb Speed Bumps
    this.speedBumps = [4260, 4360, 4440];

    // Asymmetric launch kickers: a gentle climb followed by a short, steeper
    // downslope. They are part of getHeight(), so rendering and wheel collision
    // sample the same surface instead of using decorative jump sprites.
    this.launchRamps = [
      { start: 380, rise: 12, drop: 6, height: 65 },
      { start: 760, rise: 12, drop: 6, height: 65 },
      { start: 1500, rise: 12, drop: 6, height: 65 },
      { start: 2150, rise: 12, drop: 6, height: 65 },
      { start: 2500, rise: 12, drop: 6, height: 65 },
      { start: 3100, rise: 12, drop: 6, height: 65 },
      { start: 3550, rise: 12, drop: 6, height: 65 },
      { start: 3950, rise: 12, drop: 6, height: 65 }
    ];

    // Static Fuel Canisters spaced along track (~every 450-600m)
    const fuelSpots = [180, 500, 850, 1300, 1750, 2200, 2700, 3150, 3600, 4000, 4300];
    this.fuelCans = fuelSpots.map(x => ({ x, collected: false, dynamic: false }));

    // Gizi Coins scattered in arcs and hills
    this.coins = [];
    for (let m = 50; m < 4500; m += 40) {
      if (Math.sin(m * 0.05) > -0.2) {
        this.coins.push({ x: m, collected: false });
      }
    }
  }

  getBiomeAt(meterX) {
    if (meterX < BIOMES.PANTURA.end) return BIOMES.PANTURA;
    if (meterX < BIOMES.SAWAH.end) return BIOMES.SAWAH;
    if (meterX < BIOMES.GUNUNG.end) return BIOMES.GUNUNG;
    return BIOMES.SEKOLAH;
  }

  // Returns smooth 200m transition zone blend state (1100m-1300m, 2700m-2900m, 4100m-4300m)
  getBiomeBlend(meterX) {
    const transitions = [
      { start: 1100, end: 1300, from: BIOMES.PANTURA, to: BIOMES.SAWAH },
      { start: 2700, end: 2900, from: BIOMES.SAWAH, to: BIOMES.GUNUNG },
      { start: 4100, end: 4300, from: BIOMES.GUNUNG, to: BIOMES.SEKOLAH }
    ];

    for (const tr of transitions) {
      if (meterX >= tr.start && meterX <= tr.end) {
        const rawT = (meterX - tr.start) / (tr.end - tr.start);
        const t = this.smoothstep(0, 1, rawT);
        return {
          inTransition: true,
          fromBiome: tr.from,
          toBiome: tr.to,
          t: t,
          alphaPrev: 1 - t,
          alphaNext: t
        };
      }
    }

    const current = this.getBiomeAt(meterX);
    return {
      inTransition: false,
      fromBiome: current,
      toBiome: null,
      t: 0,
      alphaPrev: 1,
      alphaNext: 0
    };
  }

  smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  getRawBiomeHeight(m, biomeId) {
    const baseElevation = 520;
    if (biomeId === 1) {
      // Biome 1: Pantura - Smooth start runway (0-160m) then coastal highway & launch ramps
      if (m < 160) return baseElevation;
      const smoothStart = Math.min(1.0, (m - 160) / 40);
      const h1 = Math.sin((m - 160) * 0.08) * 40;
      const h2 = Math.sin((m - 160) * 0.03) * 50;
      const ramp = Math.sin((m - 160) * 0.12) * 25;
      return baseElevation + (h1 + h2 + ramp) * smoothStart;
    }
    if (biomeId === 2) {
      // Biome 2: Sawah - Stepped terraced rice paddies with table jumps and rolling mounds
      const localM = m - 1200;
      const terrace = Math.sin(localM * 0.07) * 55;
      const rolls = Math.sin(localM * 0.14) * 26;
      const baseWave = Math.sin(localM * 0.025) * 45;
      return baseElevation - 30 + terrace + rolls + baseWave;
    }
    if (biomeId === 3) {
      // Biome 3: Gunung - Mountain slopes & tea plantations with steep launch kickers
      const localM = m - 2800;
      const bigClimb = -Math.min(160, localM * 0.11);
      const kicker = Math.sin(localM * 0.08) * 80;
      const mountainWave = Math.sin(localM * 0.025) * 60;
      return baseElevation - 50 + bigClimb + kicker + mountainWave;
    }
    // Biome 4: Suburb Cirebon - Approaching the fictional school district
    const localM = m - 4200;
    return baseElevation - 90 + Math.sin(localM * 0.04) * 20;
  }

  // Returns procedural ground elevation Y (in canvas px) for a given world X (in px)
  getHeight(pxX) {
    const m = pxX / PHYSICS_CONSTANTS.METER_SCALE;
    const baseElevation = 520; // Canvas baseline
    const blendDist = 100; // 200m continuous transition zones (1100-1300m, 2700-2900m, 4100-4300m)

    let y;
    if (m < 1200 - blendDist) {
      y = this.getRawBiomeHeight(m, 1);
    } else if (m < 1200 + blendDist) {
      const t = this.smoothstep(1200 - blendDist, 1200 + blendDist, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 1) + t * this.getRawBiomeHeight(m, 2);
    } else if (m < 2800 - blendDist) {
      y = this.getRawBiomeHeight(m, 2);
    } else if (m < 2800 + blendDist) {
      const t = this.smoothstep(2800 - blendDist, 2800 + blendDist, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 2) + t * this.getRawBiomeHeight(m, 3);
    } else if (m < 4200 - blendDist) {
      y = this.getRawBiomeHeight(m, 3);
    } else if (m < 4200 + blendDist) {
      const t = this.smoothstep(4200 - blendDist, 4200 + blendDist, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 3) + t * this.getRawBiomeHeight(m, 4);
    } else if (m < 4480) {
      y = this.getRawBiomeHeight(m, 4);
    } else if (m < 4520) {
      const t = this.smoothstep(4480, 4520, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 4) + t * (baseElevation - 100);
    } else {
      y = baseElevation - 100;
    }

    // Launch ramps are laid over biome elevation using smoothstep shoulders.
    // The shorter descent creates a convex crest that can launch the vehicle at
    // speed while keeping rendered terrain and collision geometry identical.
    for (const ramp of this.launchRamps) {
      const crest = ramp.start + ramp.rise;
      const end = crest + ramp.drop;
      if (m >= ramp.start && m < crest) {
        y -= ramp.height * this.smoothstep(ramp.start, crest, m);
      } else if (m >= crest && m < end) {
        y -= ramp.height * (1 - this.smoothstep(crest, end, m));
      }
    }

    // Add speed bump bumps if near any
    for (const sb of this.speedBumps) {
      const dist = Math.abs(m - sb);
      if (dist < 1.2) {
        y -= Math.cos((dist / 1.2) * Math.PI * 0.5) * 10;
      }
    }

    return y;
  }

  // Returns slope dY/dX
  getSlope(pxX) {
    const delta = 2.0;
    const y1 = this.getHeight(pxX - delta);
    const y2 = this.getHeight(pxX + delta);
    return (y2 - y1) / (2 * delta);
  }

  // Returns normalized normal vector pointing upward away from ground (canvas -Y)
  getNormal(pxX) {
    const slope = this.getSlope(pxX);
    const len = Math.sqrt(slope * slope + 1);
    // For tangent (1, slope), the upward perpendicular in canvas space is
    // (slope, -1). The old (-slope, -1) vector was not perpendicular on hills
    // and injected a sideways component into every wheel contact force.
    const nx = slope / len;
    const ny = -1 / len;
    return { x: nx, y: ny, slope, len };
  }

  // Returns surface tangent pointing forward
  getTangent(pxX) {
    const slope = this.getSlope(pxX);
    const len = Math.sqrt(slope * slope + 1);
    return { x: 1 / len, y: slope / len };
  }

  // Check if position is in seawater rob puddle
  isInWaterPuddle(meterX) {
    for (const p of this.puddles) {
      if (meterX >= p.start && meterX <= p.end) return true;
    }
    return false;
  }

  // Check if position is in mud pit
  isInMudPit(meterX) {
    for (const m of this.mudPits) {
      if (meterX >= m.start && meterX <= m.end) return true;
    }
    return false;
  }

  // Check for nearby wooden log collision
  checkLogCollision(wheelPxX, wheelPxY, wheelRadius) {
    for (const log of this.logs) {
      const logPxX = log.x * PHYSICS_CONSTANTS.METER_SCALE;
      const logPxY = this.getHeight(logPxX) - log.radius;
      const dx = wheelPxX - logPxX;
      const dy = wheelPxY - logPxY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < wheelRadius + log.radius) {
        return { hit: true, log, dist, overlap: (wheelRadius + log.radius) - dist };
      }
    }
    return { hit: false };
  }

  // Dynamic Jerrycan Spawning when fuel < 20%
  triggerDynamicJerrycanSpawn(truckMeterX) {
    // Check if there is already an uncollected jerrycan within next 300m
    const upcoming = this.fuelCans.find(
      c => !c.collected && c.x > truckMeterX && c.x <= truckMeterX + 300
    );
    if (upcoming) return null; // already have one nearby

    // Search for a hill crest between truckMeterX + 60 and truckMeterX + 220
    let bestX = truckMeterX + 120;
    let minElevation = Infinity; // lowest Y means highest hill peak in canvas
    for (let testM = truckMeterX + 60; testM <= truckMeterX + 220; testM += 5) {
      const elev = this.getHeight(testM * PHYSICS_CONSTANTS.METER_SCALE);
      if (elev < minElevation) {
        minElevation = elev;
        bestX = testM;
      }
    }

    const newCan = { x: bestX, collected: false, dynamic: true };
    this.fuelCans.push(newCan);
    return newCan;
  }
}

export class PhysicsVehicle {
  constructor(startX = 100, startY = 400) {
    // Chassis State
    this.x = startX;
    this.y = startY;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0; // In radians
    this.angularVelocity = 0;

    // Chassis dimensions & properties
    this.width = 90;
    this.height = 45;
    this.mass = PHYSICS_CONSTANTS.MASS;

    // Wheels configuration (Rear & Front)
    this.wheelRadius = 18;
    this.suspensionRestLength = 16;
    this.rearMountOffset = { x: -30, y: 0 };
    this.frontMountOffset = { x: 30, y: 0 };

    // Normalized spring & damper parameters derived from PRD values
    // K_SPRING = 1800, K_DAMPER = 48, MASS = 1400
    this.kSpring = (PHYSICS_CONSTANTS.K_SPRING / PHYSICS_CONSTANTS.MASS) * 140; // ~180
    this.kDamper = (PHYSICS_CONSTANTS.K_DAMPER / PHYSICS_CONSTANTS.MASS) * 550; // ~18.8

    // Wheel hubs dynamic positions & velocities
    this.rearWheel = {
      x: startX - 30,
      y: startY + this.suspensionRestLength,
      vx: 0,
      vy: 0,
      onGround: false,
      rotation: 0,
      hitLogId: null
    };
    this.frontWheel = {
      x: startX + 30,
      y: startY + this.suspensionRestLength,
      vx: 0,
      vy: 0,
      onGround: false,
      rotation: 0,
      hitLogId: null
    };

    // Engine & Gameplay Parameters
    this.fuel = 100; // 0 to 100%
    this.cargoIntegrity = 100; // 0 to 100%
    this.enginePower = 2200;
    this.brakePower = 850;
    this.airPitchTorque = PHYSICS_CONSTANTS.AIR_PITCH_TORQUE;
    this.engineThrottle = 0;
    this.reverseThrottle = 0;

    // Rollover tracking
    this.rolloverTimer = 0;
    this.isRolledOver = false;
    this.wasRoofTouching = false;
    this.wasBodyTouching = false;
    this.impactCooldown = 0;

    // Airborne, stunt, and landing tracking
    this.wasAirborne = false;
    this.airRotation = 0;
    this.perfectLandingTimer = 0;
    this.lastLandingPitchDiff = 0;
    this.stuntMessage = '';
    this.stuntTimer = 0;
    this.soundEngine = null;

    // Food particles ejected during shocks
    this.foodParticles = [];
    // Fixed-step accumulator keeps suspension and collision results stable when
    // the browser varies its frame rate.
    this.physicsAccumulator = 0;
    this.physicsStep = 1 / 120;
  }

  setSoundEngine(sound) {
    this.soundEngine = sound;
  }

  // Update step with sub-stepping
  update(dt, inputs, terrain) {
    const safeDt = Number.isFinite(dt) ? Math.max(0, Math.min(0.1, dt)) : 0;
    this.physicsAccumulator = Math.min(0.1, this.physicsAccumulator + safeDt);
    let steps = 0;
    while (this.physicsAccumulator + 1e-9 >= this.physicsStep && steps < 12) {
      this.physicsSubStep(this.physicsStep, inputs, terrain);
      this.physicsAccumulator -= this.physicsStep;
      steps++;
    }
    if (this.physicsAccumulator < 1e-9) this.physicsAccumulator = 0;

    // Timers and particles follow elapsed game time; the rigid body uses the
    // fixed 120 Hz step above. A 100 ms cap bounds recovery after a tab stall.
    const clampedDt = safeDt;
    this.impactCooldown = Math.max(0, this.impactCooldown - clampedDt);

    if (this.perfectLandingTimer > 0) {
      this.perfectLandingTimer = Math.max(0, this.perfectLandingTimer - clampedDt);
    }
    if (this.stuntTimer > 0) {
      this.stuntTimer = Math.max(0, this.stuntTimer - clampedDt);
    }

    // Dynamic Jerrycan Check
    if (this.fuel < 20) {
      terrain.triggerDynamicJerrycanSpawn(this.x / PHYSICS_CONSTANTS.METER_SCALE);
    }

    // Check item pickups
    this.checkPickups(terrain);

    // Update food particles
    for (let i = this.foodParticles.length - 1; i >= 0; i--) {
      const p = this.foodParticles[i];
      p.x += p.vx * clampedDt;
      p.y += p.vy * clampedDt;
      p.vy += PHYSICS_CONSTANTS.GRAVITY * clampedDt;
      p.rot += p.vrot * clampedDt;
      p.life -= clampedDt;
      if (p.life <= 0) {
        this.foodParticles.splice(i, 1);
      }
    }
  }

  physicsSubStep(dt, inputs, terrain) {
    const chassisTangent = terrain.getTangent(this.x);
    const chassisTrackSpeed = this.vx * chassisTangent.x + this.vy * chassisTangent.y;
    const roadAngle = Math.atan2(chassisTangent.y, chassisTangent.x);
    const chassisPitch = Math.atan2(
      Math.sin(this.angle - roadAngle),
      Math.cos(this.angle - roadAngle)
    );
    const throttleTarget = inputs.gas && this.fuel > 0 ? 1 : 0;
    const throttleRate = throttleTarget > this.engineThrottle
      ? PHYSICS_CONSTANTS.THROTTLE_RAMP_UP
      : PHYSICS_CONSTANTS.THROTTLE_RAMP_DOWN;
    this.engineThrottle += Math.sign(throttleTarget - this.engineThrottle)
      * Math.min(Math.abs(throttleTarget - this.engineThrottle), throttleRate * dt);

    const reverseTarget = inputs.brake && this.fuel > 0 && Math.abs(chassisTrackSpeed) <= 12 ? 1 : 0;
    const reverseRate = reverseTarget > this.reverseThrottle
      ? PHYSICS_CONSTANTS.REVERSE_RAMP_UP
      : PHYSICS_CONSTANTS.THROTTLE_RAMP_DOWN;
    this.reverseThrottle += Math.sign(reverseTarget - this.reverseThrottle)
      * Math.min(Math.abs(reverseTarget - this.reverseThrottle), reverseRate * dt);

    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // Mount points in world coordinates
    const rmx = this.x + (this.rearMountOffset.x * cosA - this.rearMountOffset.y * sinA);
    const rmy = this.y + (this.rearMountOffset.x * sinA + this.rearMountOffset.y * cosA);
    const fmx = this.x + (this.frontMountOffset.x * cosA - this.frontMountOffset.y * sinA);
    const fmy = this.y + (this.frontMountOffset.x * sinA + this.frontMountOffset.y * cosA);

    // Suspension vector direction (pointing downward from chassis bottom)
    const strutNx = -sinA;
    const strutNy = cosA;

    // Process Rear Wheel Suspension & Ground Contact
    const rSusp = this.solveWheelSuspension(
      this.rearWheel, rmx, rmy, strutNx, strutNy, dt, terrain, inputs, true
    );
    // Process Front Wheel Suspension & Ground Contact
    const fSusp = this.solveWheelSuspension(
      this.frontWheel, fmx, fmy, strutNx, strutNy, dt, terrain, inputs, false
    );

    // Air Control, Landing Absorption & Hill Climb Racing Ground Torque
    const inAir = !this.rearWheel.onGround && !this.frontWheel.onGround;
    let driveTorque = 0;
    let weightTransferForce = 0;

    if (inAir) {
      this.wasAirborne = true;
      this.airRotation += this.angularVelocity * dt;
      if (inputs.gas) {
        // Pitch nose up (counter-clockwise in canvas)
        this.angularVelocity -= this.airPitchTorque * dt;
      }
      if (inputs.brake) {
        // Pitch nose down (clockwise in canvas)
        this.angularVelocity += this.airPitchTorque * dt;
      }
    } else {
      if (this.wasAirborne) {
        this.handleLanding(terrain);
        this.wasAirborne = false;
        this.airRotation = 0;
      }

      // Hill Climb Racing Ground Torque & Weight Transfer:
      // Drive wheel traction reaction torque on chassis (pitches front up on gas, down on brake)
      const pitchBalanced = inputs.gas && inputs.brake;
      if (!pitchBalanced && inputs.gas && this.engineThrottle > 0 && this.fuel > 0) {
        const traction = this.rearWheel.onGround ? 1.0 : 0.4;
        const surfaceTraction = terrain.isInWaterPuddle(this.x / PHYSICS_CONSTANTS.METER_SCALE)
          ? PHYSICS_CONSTANTS.WATER_SLIP_TRACTION
          : terrain.isInMudPit(this.x / PHYSICS_CONSTANTS.METER_SCALE)
            ? PHYSICS_CONSTANTS.MUD_SLIP_TRACTION
            : 1.0;
        // Engine reaction pitches the nose up. Fade that torque as forward
        // speed rises so a long throttle hold cannot wind the chassis into flips.
        const speedTorqueScale = Math.max(0.25,
          1 - Math.abs(this.vx) / PHYSICS_CONSTANTS.MAX_FORWARD_SPEED);
        const highPitchRisk = Math.abs(chassisPitch) > 45 * Math.PI / 180;
        const pitchThrottle = highPitchRisk ? 1 : this.engineThrottle;
        driveTorque += PHYSICS_CONSTANTS.GROUND_GAS_PITCH_TORQUE * pitchThrottle
          * traction * surfaceTraction * speedTorqueScale;
        weightTransferForce += 22 * traction; // Transfers downforce to rear suspension
      }
      // Ground brake pitch acts independently from throttle. Holding both
      // cancels ground pitch torque while the gas path keeps the rear drive on.
      if (!pitchBalanced && inputs.brake) {
        const traction = this.frontWheel.onGround ? 1.0 : 0.4;
        const surfaceTraction = terrain.isInWaterPuddle(this.x / PHYSICS_CONSTANTS.METER_SCALE)
          ? PHYSICS_CONSTANTS.WATER_SLIP_TRACTION
          : terrain.isInMudPit(this.x / PHYSICS_CONSTANTS.METER_SCALE)
            ? PHYSICS_CONSTANTS.MUD_SLIP_TRACTION
            : 1.0;
        const brakeTorqueScale = Math.min(1, Math.abs(chassisTrackSpeed) / 220);
        driveTorque -= PHYSICS_CONSTANTS.GROUND_BRAKE_PITCH_TORQUE * traction * surfaceTraction * brakeTorqueScale;
        weightTransferForce -= 26 * traction; // Transfers downforce to front suspension
      }
    }

    // Dynamic weight transfer adjusts suspension mount loads along strut vector
    const rTotalFx = rSusp.fx + weightTransferForce * strutNx;
    const rTotalFy = rSusp.fy + weightTransferForce * strutNy;
    const fTotalFx = fSusp.fx - weightTransferForce * strutNx;
    const fTotalFy = fSusp.fy - weightTransferForce * strutNy;

    // Chassis spring-damper forces and longitudinal drive/friction forces from wheels
    let fx = - (rTotalFx + fTotalFx) + (rSusp.driveFx + fSusp.driveFx);
    let fy = PHYSICS_CONSTANTS.GRAVITY - (rTotalFy + fTotalFy);

    // Suspension torque on chassis
    const rTorque = (rmx - this.x) * (-rTotalFy) - (rmy - this.y) * (-rTotalFx);
    const fTorque = (fmx - this.x) * (-fTotalFy) - (fmy - this.y) * (-fTotalFx);
    const totalTorque = (rTorque + fTorque) * 0.003 - driveTorque;

    // Angular acceleration & integration
    this.angularVelocity += totalTorque * dt;
    this.angularVelocity *= (1 - PHYSICS_CONSTANTS.ANGULAR_DAMPING * dt);
    this.angularVelocity = Math.max(-PHYSICS_CONSTANTS.MAX_ANGULAR_SPEED,
      Math.min(PHYSICS_CONSTANTS.MAX_ANGULAR_SPEED, this.angularVelocity));
    this.angle += this.angularVelocity * dt;

    // Linear acceleration & integration
    this.vx += fx * dt;
    // A fixed arcade speed envelope prevents constant-force runaway on long
    // descents while leaving enough pace to finish within the game deadline.
    this.vx = Math.max(-PHYSICS_CONSTANTS.MAX_REVERSE_SPEED,
      Math.min(PHYSICS_CONSTANTS.MAX_FORWARD_SPEED, this.vx));
    this.vy += fy * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Check roof, bottom, and body terrain penetration
    this.checkChassisTerrainCollision(terrain, dt);
  }

  handleLanding(terrain) {
    const slope = terrain.getSlope(this.x);
    const slopeAngle = Math.atan(slope);
    const normal = terrain.getNormal(this.x);
    const normalImpactSpeed = this.absorbLandingNormalVelocity(this, normal, 0);
    // Angular difference relative to terrain slope tangent wrapped to [-PI, PI]
    const angleDiff = Math.abs(Math.atan2(Math.sin(this.angle - slopeAngle), Math.cos(this.angle - slopeAngle)));
    const angleDiffDeg = (angleDiff * 180) / Math.PI;
    this.lastLandingPitchDiff = angleDiffDeg;

    // Track completed flips
    const totalFlips = Math.round(Math.abs(this.airRotation) / (2 * Math.PI));
    if (totalFlips >= 1) {
      const isBackflip = this.airRotation < 0;
      const flipName = totalFlips > 1 ? `${totalFlips}x ${isBackflip ? 'BACKFLIP' : 'FRONTFLIP'}` : (isBackflip ? 'BACKFLIP' : 'FRONTFLIP');
      this.stuntMessage = `${flipName}! ⭐`;
      this.stuntTimer = 1.8;
    }

    if (angleDiffDeg <= 22) {
      // A well-aligned landing absorbs the normal component and preserves
      // forward momentum along the slope. A separating/tiny brush is not a
      // landing reward and must not show a false "perfect" banner.
      this.absorbLandingNormalVelocity(this.rearWheel, terrain.getNormal(this.rearWheel.x), 0.9);
      this.absorbLandingNormalVelocity(this.frontWheel, terrain.getNormal(this.frontWheel.x), 0.9);
      this.absorbLandingNormalVelocity(this, normal, 0.9);

      if (normalImpactSpeed >= 30) {
        this.perfectLandingTimer = 1.5;
      }
      if (normalImpactSpeed >= 30 && this.soundEngine && typeof this.soundEngine.playSuspensionSpringSound === 'function') {
        this.soundEngine.playSuspensionSpringSound();
      }
    } else if (angleDiffDeg <= 35) {
      // Slightly misaligned landings absorb 70% of the impact normal.
      this.absorbLandingNormalVelocity(this.rearWheel, terrain.getNormal(this.rearWheel.x), 0.7);
      this.absorbLandingNormalVelocity(this.frontWheel, terrain.getNormal(this.frontWheel.x), 0.7);
      this.absorbLandingNormalVelocity(this, normal, 0.7);
      if (normalImpactSpeed >= 30 && this.soundEngine && typeof this.soundEngine.playSuspensionSpringSound === 'function') {
        this.soundEngine.playSuspensionSpringSound();
      }
    } else {
      // A steeply misaligned impact damages cargo by incoming speed along the
      // surface normal, even when the world-vertical component is small.
      if (normalImpactSpeed > 60) {
        this.applyImpactShock(normalImpactSpeed + 40);
        this.absorbLandingNormalVelocity(this.rearWheel, terrain.getNormal(this.rearWheel.x), 0.8);
        this.absorbLandingNormalVelocity(this.frontWheel, terrain.getNormal(this.frontWheel.x), 0.8);
        this.absorbLandingNormalVelocity(this, normal, 0.8);
      }
    }
  }

  // Remove a fraction of only the velocity component moving into the surface.
  // Tangential travel along the slope remains unchanged, as it should for a
  // wheel/suspension impact without a friction impulse.
  absorbLandingNormalVelocity(body, normal, absorption) {
    const normalVelocity = body.vx * normal.x + body.vy * normal.y;
    if (normalVelocity >= 0) return 0;
    body.vx -= normalVelocity * absorption * normal.x;
    body.vy -= normalVelocity * absorption * normal.y;
    return -normalVelocity;
  }

  solveWheelSuspension(wheel, mx, my, strutNx, strutNy, dt, terrain, inputs, isDriveWheel) {
    // Current distance from mount to wheel hub
    const dx = wheel.x - mx;
    const dy = wheel.y - my;
    let currentLength = dx * strutNx + dy * strutNy;
    const minSuspTravel = 6;
    const maxSuspTravel = 24;
    currentLength = Math.max(minSuspTravel, Math.min(maxSuspTravel, currentLength));

    // Constrain wheel position to stay strictly on the suspension strut arm
    wheel.x = mx + strutNx * currentLength;
    wheel.y = my + strutNy * currentLength;

    // True damped harmonic oscillation for dual-strut suspension:
    // Soft elastic spring compression (deltaL > 0) with asymmetric damping:
    // - Softer bump damping on compression (relVProj < 0) so the vehicle absorbs bumps without jitter
    // - Progressive rebound damping on extension (relVProj > 0) to prevent pogo oscillations
    const deltaL = this.suspensionRestLength - currentLength;
    const relVx = wheel.vx - this.vx;
    const relVy = wheel.vy - this.vy;
    const relVProj = relVx * strutNx + relVy * strutNy;

    let damperCoeff = this.kDamper;
    if (relVProj < 0) {
      // Compression (bump): softer bump damping
      damperCoeff = this.kDamper * 0.45;
    } else {
      // Extension (rebound): progressive damping
      damperCoeff = this.kDamper * (1.35 + Math.max(0, -deltaL) * 0.05);
    }

    const springForce = Math.max(0, this.kSpring * deltaL);
    const damperForce = damperCoeff * relVProj;
    const fSuspMag = Math.max(0, springForce - damperForce);
    const suspFx = fSuspMag * strutNx;
    const suspFy = fSuspMag * strutNy;

    // Trigger spring sound on deep compression
    if (deltaL >= 8 || currentLength <= minSuspTravel + 1) {
      if (this.soundEngine && typeof this.soundEngine.playSuspensionSpringSound === 'function') {
        this.soundEngine.playSuspensionSpringSound();
      }
    }

    // Wheel ground contact
    const groundY = terrain.getHeight(wheel.x);
    const penetration = (wheel.y + this.wheelRadius) - groundY;
    wheel.onGround = (penetration >= -2);

    let groundFx = 0;
    let groundFy = 0;
    let driveFx = 0;

    if (penetration > 0) {
      const normal = terrain.getNormal(wheel.x); // pointing up
      const tangent = terrain.getTangent(wheel.x); // pointing forward along slope

      // Normal restitution & clamping
      const normalSpring = 520;
      const normalDamper = 35;
      const vDotN = wheel.vx * normal.x + wheel.vy * normal.y;
      const normalForceMag = Math.max(0, normalSpring * penetration - normalDamper * vDotN);

      groundFx += normal.x * normalForceMag;
      groundFy += normal.y * normalForceMag;

      // Anti-tunneling / clamping: clamp penetration > 8px
      if (penetration > PHYSICS_CONSTANTS.MAX_PENETRATION_CLAMP) {
        wheel.y = groundY - this.wheelRadius;
        // Damping vertical velocity 80% as mandated in PRD
        if (wheel.vy > 0) {
          wheel.vy *= 0.2;
        }
      }

      // Check Hazard traction factors
      const meterX = wheel.x / PHYSICS_CONSTANTS.METER_SCALE;
      let tractionFactor = 1.0;
      if (terrain.isInWaterPuddle(meterX)) {
        tractionFactor = PHYSICS_CONSTANTS.WATER_SLIP_TRACTION; // 0.85
      } else if (terrain.isInMudPit(meterX)) {
        tractionFactor = PHYSICS_CONSTANTS.MUD_SLIP_TRACTION;
      }

      const vDotT = wheel.vx * tangent.x + wheel.vy * tangent.y;

      // Drive traction
      let driveForce = 0;
      if (inputs.gas && this.engineThrottle > 0 && this.fuel > 0) {
        // Rear-wheel drive: do not apply a second, free engine force to the
        // front wheel. Fuel is consumed by this same driven axle below.
        driveForce = isDriveWheel ? this.enginePower * this.engineThrottle * tractionFactor : 0;
        if (isDriveWheel) {
          this.fuel = Math.max(0, this.fuel - 2.2 * this.engineThrottle * dt);
        }
      } else if (inputs.brake) {
        // Brake against current travel first; only select reverse near a stop.
        // This keeps the same pedal useful for both HCR-style braking and the
        // game's advertised reverse control without instantly throwing the truck backward.
        const speedAlongTrack = this.vx * tangent.x + this.vy * tangent.y;
        if (speedAlongTrack > 12) {
          driveForce = -this.brakePower * tractionFactor;
        } else if (speedAlongTrack < -12) {
          driveForce = this.brakePower * tractionFactor;
        } else {
          // Reverse is engine torque, not a mechanical braking force. Empty
          // fuel must therefore disable it just as it disables forward drive.
          driveForce = isDriveWheel && this.fuel > 0
            ? -this.enginePower * 0.45 * this.reverseThrottle * tractionFactor
            : 0;
          if (isDriveWheel && this.fuel > 0) {
            this.fuel = Math.max(0, this.fuel - 2.2 * this.reverseThrottle * dt);
          }
        }
      }

      // Apply drive force along terrain tangent
      groundFx += tangent.x * driveForce;
      groundFy += tangent.y * driveForce;

      // Lateral rolling resistance & tire friction damping opposing slide
      const frictionMag = -vDotT * 0.9 * tractionFactor;
      groundFx += tangent.x * frictionMag;
      groundFy += tangent.y * frictionMag;

      // Mud drag must reach the chassis. Damping only the free wheel velocity
      // before engine force was ineffective and could make mud retain more speed.
      const mudDragMag = terrain.isInMudPit(meterX)
        ? -vDotT * PHYSICS_CONSTANTS.MUD_DRAG_RATE * 0.5
        : 0;
      groundFx += tangent.x * mudDragMag;
      groundFy += tangent.y * mudDragMag;

      // Wheel rotation
      wheel.rotation += (vDotT / this.wheelRadius) * dt;

      // Longitudinal drive force transmitted to vehicle chassis
      driveFx = tangent.x * (driveForce + frictionMag + mudDragMag);

      // Check wooden log collision (debounced per contact entry)
      const logCol = terrain.checkLogCollision(wheel.x, wheel.y, this.wheelRadius);
      if (logCol.hit) {
        if (wheel.hitLogId !== logCol.log.x) {
          wheel.hitLogId = logCol.log.x;
          // Vertical impulse Delta v_y = -140 px/s
          wheel.vy = PHYSICS_CONSTANTS.LOG_IMPULSE_VY;
          this.applyImpactShock(Math.abs(PHYSICS_CONSTANTS.LOG_IMPULSE_VY) + 15);
        }
      } else if (wheel.hitLogId !== null) {
        const logPx = wheel.hitLogId * PHYSICS_CONSTANTS.METER_SCALE;
        if (Math.abs(wheel.x - logPx) > 50) {
          wheel.hitLogId = null;
        }
      }
    } else {
      // Free spin in air
      if (inputs.gas) wheel.rotation += 18 * dt;
      if (inputs.brake) wheel.rotation -= 8 * dt;
    }

    // Integrate wheel hub
    const wNetFx = suspFx + groundFx;
    const wNetFy = suspFy + groundFy + PHYSICS_CONSTANTS.GRAVITY;

    wheel.vx += wNetFx * dt;
    wheel.vy += wNetFy * dt;
    wheel.x += wheel.vx * dt;
    wheel.y += wheel.vy * dt;

    // Constrain wheel position relative to mount along suspension strut
    const curLen = (wheel.x - mx) * strutNx + (wheel.y - my) * strutNy;
    if (curLen > maxSuspTravel) {
      wheel.x = mx + strutNx * maxSuspTravel;
      wheel.y = my + strutNy * maxSuspTravel;
    } else if (curLen < minSuspTravel) {
      wheel.x = mx + strutNx * minSuspTravel;
      wheel.y = my + strutNy * minSuspTravel;
    }

    // Keep wheel velocity coupled to chassis forward velocity
    wheel.vx = this.vx + (wheel.vx - this.vx) * 0.8;

    return { fx: suspFx, fy: suspFy, driveFx };
  }

  checkChassisTerrainCollision(terrain, dt) {
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // Normalized tilt angle relative to upright [0, PI]
    const tilt = Math.abs(Math.atan2(Math.sin(this.angle), Math.cos(this.angle)));
    const isTilted = tilt > PHYSICS_CONSTANTS.ROLLOVER_ANGLE;

    // Multi-point roof collision check (Center roof, Front cab top, Driver head, Rear box top)
    const roofPoints = [
      { lx: 0, ly: -this.height * 0.85 },
      { lx: this.width * 0.35, ly: -this.height * 0.8 },
      { lx: 22, ly: -this.height * 0.82 },
      { lx: -this.width * 0.4, ly: -this.height * 0.85 }
    ];

    let isRoofTouching = false;
    for (const rp of roofPoints) {
      const rx = this.x + (rp.lx * cosA - rp.ly * sinA);
      const ry = this.y + (rp.lx * sinA + rp.ly * cosA);
      if (ry >= terrain.getHeight(rx)) {
        isRoofTouching = true;
        break;
      }
    }

    const roofImpactEntry = isRoofTouching && isTilted && !this.wasRoofTouching;
    if (isRoofTouching && isTilted) {
      this.rolloverTimer += dt;
      if (this.rolloverTimer >= PHYSICS_CONSTANTS.ROLLOVER_GRACE_TIME) {
        this.isRolledOver = true;
      }
      // Hard roof slam shock (triggered once per roof impact entry)
      if (roofImpactEntry) {
        this.applyImpactShock(200);
        this.wasRoofTouching = true;
      }
    } else {
      this.wasRoofTouching = false;
      // Grace period resets if righted
      this.rolloverTimer = Math.max(0, this.rolloverTimer - dt * 2);
    }

    // Multi-point raycast anti-tunneling clamp (Roof, Bottom, Front, Rear)
    const testPoints = [
      { lx: 0, ly: -this.height * 0.85 }, // Roof
      { lx: 0, ly: this.height * 0.2 },    // Bottom undercarriage clearance
      { lx: this.width * 0.45, ly: 0 },    // Front bumper
      { lx: -this.width * 0.45, ly: 0 }    // Rear bumper
    ];

    let isBodyTouching = false;
    let bodyImpactIntensity = 0;
    for (const pt of testPoints) {
      const wx = this.x + (pt.lx * cosA - pt.ly * sinA);
      const wy = this.y + (pt.lx * sinA + pt.ly * cosA);
      const gy = terrain.getHeight(wx);

      // Keep contact latched through tiny numerical gaps. Without this margin,
      // the body can alternate between contact and free space every few ticks.
      if (wy >= gy - 2) isBodyTouching = true;

      if (wy > gy) {
        const pen = wy - gy;
        this.y -= pen * 0.4;
        if (pt.ly > 0) {
          // Bottom undercarriage: only damp horizontal speed during severe bottom-out
          if (pen > 4 && this.vy > 60) {
            this.vx *= 0.98;
            const slope = terrain.getSlope(this.x);
            const slopeAngle = Math.atan(slope);
            const diffDeg = Math.abs(Math.atan2(Math.sin(this.angle - slopeAngle), Math.cos(this.angle - slopeAngle))) * 180 / Math.PI;
            if (diffDeg > 35) {
              bodyImpactIntensity = Math.max(bodyImpactIntensity, this.vy);
            }
            this.vy *= 0.3;
          }
        } else {
          if (this.vy > 120) {
            const slope = terrain.getSlope(this.x);
            const slopeAngle = Math.atan(slope);
            const diffDeg = Math.abs(Math.atan2(Math.sin(this.angle - slopeAngle), Math.cos(this.angle - slopeAngle))) * 180 / Math.PI;
            if (diffDeg > 35) {
              bodyImpactIntensity = Math.max(bodyImpactIntensity, this.vy);
            }
            this.vy *= 0.2; // 80% vertical damping per PRD Section 6
          }
          this.vx *= 0.96;
        }
      }
    }

    // One chassis contact can overlap several ray points and persist across
    // many 120 Hz steps. Damage once on entry instead of once per point/frame.
    if (isBodyTouching && !this.wasBodyTouching && !roofImpactEntry && bodyImpactIntensity > 0) {
      this.applyImpactShock(bodyImpactIntensity);
    }
    this.wasBodyTouching = isBodyTouching;
  }

  triggerImpactShock(intensity) {
    if (intensity < 120) return;
    const damage = Math.min(25, (intensity - 100) * 0.06);
    this.cargoIntegrity = Math.max(0, this.cargoIntegrity - damage);

    // Eject comical food particles
    const particleTypes = ['tofu', 'tempe', 'milk', 'serundeng', 'lodeh'];
    const count = Math.min(10, Math.floor(damage * 0.8) + 2);
    for (let i = 0; i < count; i++) {
      const pType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      this.foodParticles.push({
        type: pType,
        x: this.x - 40 + (Math.random() * 20 - 10),
        y: this.y - 15 + (Math.random() * 10 - 5),
        vx: this.vx * 0.5 - 80 - Math.random() * 100,
        vy: -100 - Math.random() * 150,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 15,
        life: 1.5 + Math.random() * 0.8
      });
    }
  }

  applyImpactShock(intensity) {
    if (intensity < 120 || this.impactCooldown > 0) return false;
    this.impactCooldown = 0.35;
    this.triggerImpactShock(intensity);
    return true;
  }

  checkPickups(terrain) {
    const truckMeterX = this.x / PHYSICS_CONSTANTS.METER_SCALE;

    // Fuel Jerrycans (+30 percentage points): leave a usable reserve after the added jump sections.
    for (const can of terrain.fuelCans) {
      if (!can.collected && Math.abs(truckMeterX - can.x) < 2.5) {
        can.collected = true;
        this.fuel = Math.min(100, this.fuel + 30);
      }
    }

    // Coins
    for (const coin of terrain.coins) {
      if (!coin.collected && Math.abs(truckMeterX - coin.x) < 2.0) {
        coin.collected = true;
      }
    }
  }
}

export class GameStateManager {
  constructor() {
    this.state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY'
    this.gameOverReason = null; // 'ROLLOVER' | 'FUEL' | 'DEADLINE' | 'CARGO'
    this.timeLimitSeconds = 210; // 3m 30s countdown to 09:45:00 WIB
    this.timeRemaining = this.timeLimitSeconds;
    this.coinsCollected = 0;
    this.stars = 0;
  }

  update(dt, vehicle, terrain) {
    if (this.state !== 'PLAYING') return;

    // Countdown timer
    this.timeRemaining = Math.max(0, this.timeRemaining - dt);
    if (this.timeRemaining <= 0) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'DEADLINE';
      return;
    }

    // Rollover condition
    if (vehicle.isRolledOver) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'ROLLOVER';
      return;
    }

    // Cargo destroyed condition
    if (vehicle.cargoIntegrity <= 0) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'CARGO';
      return;
    }

    // Fuel out condition (fuel == 0 and vehicle almost stopped or rolling backwards)
    if (vehicle.fuel <= 0 && (Math.abs(vehicle.vx) < 6 || vehicle.vx < -10)) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'FUEL';
      return;
    }

    // Count collected coins
    this.coinsCollected = terrain.coins.filter(c => c.collected).length;

    // Victory condition: crossed finish line at 4500m
    const meterX = vehicle.x / PHYSICS_CONSTANTS.METER_SCALE;
    if (meterX >= terrain.finishLineMeters) {
      this.state = 'VICTORY';
      this.calculateStars(vehicle);
    }
  }

  calculateStars(vehicle) {
    let s = 1;
    // 2 stars: Cargo >= 40% and Fuel > 0%
    if (vehicle.cargoIntegrity >= 40 && vehicle.fuel > 0) {
      s = 2;
    }
    // Three stars require a safe delivery, reserve fuel, and a meaningful deadline margin.
    // The 210s deadline accommodates the slower HCR-style driving pace of the 4.5 km route.
    if (vehicle.cargoIntegrity >= 70 && vehicle.fuel >= 20 && this.timeRemaining >= 30) {
      s = 3;
    }
    this.stars = s;
    return s;
  }
}
