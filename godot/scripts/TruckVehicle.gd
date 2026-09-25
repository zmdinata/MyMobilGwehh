extends RigidBody2D
class_name TruckVehicle

# TruckVehicle.gd - Godot 4 2D Physics Truck Controller for MBG: Road To School
# Implements Hill Climb Racing 2D physics with spring suspension, engine torque, and cargo safety.

@export var engine_power: float = 2200.0
@export var brake_power: float = 850.0
@export var tire_grip: float = 1.0
@export var air_torque: float = 4.0

var fuel: float = 100.0
var cargo_integrity: float = 100.0
var is_rolled_over: bool = false
var rollover_timer: float = 0.0

@onready var rear_wheel: RigidBody2D = $RearWheel
@onready var front_wheel: RigidBody2D = $FrontWheel
@onready var rear_spring: DampedSpringJoint2D = $RearSpring
@onready var front_spring: DampedSpringJoint2D = $FrontSpring

signal fuel_changed(new_fuel: float)
signal cargo_changed(new_cargo: float)
signal vehicle_rolled_over(reason: String)

func _physics_process(delta: float) -> void:
	if is_rolled_over:
		return

	var gas_input := Input.is_action_pressed("ui_right") or Input.is_action_pressed("gas")
	var brake_input := Input.is_action_pressed("ui_left") or Input.is_action_pressed("brake")

	# Check fuel
	if fuel <= 0.0:
		gas_input = false
		brake_input = false

	# Apply rear wheel drive torque
	if gas_input and rear_wheel:
		var drive_torque = engine_power * tire_grip * 15.0
		rear_wheel.apply_torque(drive_torque)
		fuel = max(0.0, fuel - 2.2 * delta)
		fuel_changed.emit(fuel)
	elif brake_input and rear_wheel:
		var rev_torque = -engine_power * 0.45 * tire_grip * 15.0
		rear_wheel.apply_torque(rev_torque)
		fuel = max(0.0, fuel - 2.2 * delta)
		fuel_changed.emit(fuel)

	# Airborne pitch correction
	var is_airborne = not is_on_ground()
	if is_airborne:
		if gas_input:
			apply_torque_impulse(air_torque * 40.0)
		elif brake_input:
			apply_torque_impulse(-air_torque * 40.0)

	# Rollover check (> 105 degrees)
	if abs(rotation) > deg_to_rad(105.0):
		rollover_timer += delta
		if rollover_timer > 0.45:
			is_rolled_over = true
			vehicle_rolled_over.emit("ROLLOVER")
	else:
		rollover_timer = 0.0

func is_on_ground() -> bool:
	# Returns true if either wheel is touching ground
	return (rear_wheel and rear_wheel.get_contact_count() > 0) or \
	       (front_wheel and front_wheel.get_contact_count() > 0)

func apply_upgrades(engine_lvl: int, grip_lvl: int, susp_lvl: int) -> void:
	engine_power = 2200.0 + (engine_lvl - 1) * 80.0
	tire_grip = 1.0 + (grip_lvl - 1) * 0.03
	if rear_spring and front_spring:
		rear_spring.stiffness = 180.0 + (susp_lvl - 1) * 4.0
		rear_spring.damping = 18.8 + (susp_lvl - 1) * 0.4
		front_spring.stiffness = 180.0 + (susp_lvl - 1) * 4.0
		front_spring.damping = 18.8 + (susp_lvl - 1) * 0.4
