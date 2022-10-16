AddCSLuaFile()

local VehicleName = "Nissan Skyline (CIV)"

local A = "AMBER"
local R = "RED"
local DR = "D_RED"
local B = "BLUE"
local W = "WHITE"
local CW = "C_WHITE"
local SW = "S_WHITE"

local EMV = {}

EMV.Siren = 0
EMV.Skin = 0
EMV.Color = Color(255, 93, 0)

-- Vehicle
EMV.BodyGroups = {{0, 0}, -- Body
{1, 0}, -- fbumper
{2, 1}, -- cage
{3, 0}, -- mirrors
{4, 0}, -- hood
{5, 0}, -- boot
{6, 0}, -- rbumper
{7, 0}, -- wing
{8, 0}, -- wheels
{9, 0}, -- clamped1
{10, 0} -- clamped2
}

-- Emergency Lights
EMV.Auto = {}

-- Vehicle Lights
EMV.Meta = {
    head_low = {
        AngleOffset = -90,
        W = 12,
        H = 12,
        Sprite = "sprites/emv/circular_src",
        Scale = 2,
        VisRadius = 16
    },
    head_high = {
        AngleOffset = -90,
        W = 10,
        H = 10,
        Sprite = "sprites/emv/circular_src",
        Scale = 2,
        VisRadius = 16
    }
}

EMV.Positions = {
    [1] = {Vector(32, 93, 32), Angle(0, 0, 0), "head_low"},
    [2] = {Vector(-32, 93, 32), Angle(0, 0, 0), "head_low"},
    [3] = {Vector(24, 93, 31.5), Angle(0, 0, 0), "head_high"},
    [4] = {Vector(-24, 93, 31.5), Angle(0, 0, 0), "head_high"},
}

EMV.Sequences = {
    Sequences = {{
        Name = "None",
        Stage = "M1",
        Components = {},
        Disconnect = {}
    }},
    Traffic = {{
        Name = "None",
        Stage = "L",
        Components = {},
        Disconnect = {}
    }},
    Illumination = {{
        Name = "SCENE",
        Components = {{1, SW, 1}, {2, SW, 1}},
        Lights = {{Vector(-32, 94, 32), Angle(0, 90, -0), "scene_lamp"},
                  {Vector(32, 94, 32), Angle(0, 90, -0), "scene_lamp"}},
        Disconnect = {}
    }, {
        Name = "TKDN",
        Components = {{1, SW, 1}, {2, SW, 1}, {3, SW, 1}, {4, SW, 1}},
        Lights = {{Vector(-32, 94, 32), Angle(0, 90, -0), "scene_lamp"},
                  {Vector(32, 94, 32), Angle(0, 90, -0), "scene_lamp"},
                  {Vector(-24, 94, 31.5), Angle(0, 90, -0), "scene_high_lamp"},
                  {Vector(-24, 94, 31.5), Angle(0, 90, -0), "scene_high_lamp"}},
        Disconnect = {}
    }}
}

EMV.Lamps = {
    ["scene_lamp"] = {
        Color = Color(200, 200, 200, 255),
        Texture = "effects/flashlight001",
        Near = 8,
        FOV = 120,
        Distance = 1500
    },
    ["scene_high_lamp"] = {
        Color = Color(200, 200, 200, 255),
        Texture = "effects/flashlight001",
        Near = 8,
        FOV = 800,
        Distance = 1750
    }
}

local PI = {}

PI.Meta = {
    reverse = {
        AngleOffset = 90,
        W = 7,
        H = 14,
        Sprite = "sprites/emv/led_lightbar",
		Scale = 4,
		WMult = 1.2
    },
    head_low = {
        AngleOffset = -90,
        W = 8,
        H = 8,
        Sprite = "sprites/emv/circular_src",
        Scale = 1,
        VisRadius = 16
    },
    brake = {
        AngleOffset = 90,
        W = 6,
        H = 14,
        Sprite = "sprites/emv/led_lightbar",
		Scale = 1.5,
		WMult = 1.2
    },
    indicator = {
        AngleOffset = -90,
        W = 12,
        H = 10,
        Sprite = "sprites/emv/blank",
		Scale = 1.5,
		WMult = 1.2
    },
}

PI.Positions = {
    [1] = {Vector(32, 93, 32), Angle(0, 0, 0), "head_low"},
    [2] = {Vector(-32, 93, 32), Angle(0, 0, 0), "head_low"},
    [3] = {Vector(29.5, -116, 23.25), Angle(0, 0, 0), "reverse"},
    [4] = {Vector(-29.5, -116, 23.25), Angle(0, 0, 0), "reverse"},
    [5] = {Vector(29, -114, 36), Angle(0, 0, 0), "brake"},
    [6] = {Vector(-29, -114, 36), Angle(0, 0, 0), "brake"},
    [7] = {Vector(21.5, -114, 36), Angle(0, 0, 0), "brake"},
    [8] = {Vector(-21.5, -114, 36), Angle(0, 0, 0), "brake"},
    [9] = {Vector(28.5, 93, 23.9), Angle(0, 0, 0), "indicator"},
    [10] = {Vector(-28.5, 93, 23.9), Angle(0, 0, 0), "indicator"},
    [11] = {Vector(38, 88, 32), Angle(0, -90, 0), "indicator"},
    [12] = {Vector(-38, 88, 32), Angle(0, 90, 0), "indicator"},
}

PI.States = {}

PI.States.Headlights = {}
PI.States.Brakes = {
    {5, R, 2}, {6, R, 2}, 
    {7, R, 2}, {8, R, 2}
}
PI.States.Blink_Left = {
    {6, R, 3},
    {10, A, 1},
    {12, A, 1}
}
PI.States.Blink_Right = {
    {5, R, 3},
    {9, A, 1},
    {11, A, 1}
}
PI.States.Reverse = {
    {3, SW, 1}, {4, SW, 1}
}
PI.States.Running = {
    {1, SW, 1}, {2, SW, 1},
    {5, R, 1}, {6, R, 1}
}

local V = {
    Name = VehicleName,
    Class = "prop_vehicle_jeep",
    Category = "[XCW] Vehicles",
    Author = "XC Walker",
    Model = "models/LoneWolfie/2000gtr_stock.mdl",
    KeyValues = {
        vehiclescript = "scripts/vehicles/LWCars/2000gtr_stock.txt"
    },
    IsEMV = true,
    EMV = EMV,
    HasPhoton = true,
    Photon = PI
}
list.Set("Vehicles", "xcw-nissan_skyline-CIV", V)

if EMVU then
    EMVU:OverwriteIndex(VehicleName, EMV)
end
if Photon then 
    Photon:OverwriteIndex( VehicleName, PI ) 
end