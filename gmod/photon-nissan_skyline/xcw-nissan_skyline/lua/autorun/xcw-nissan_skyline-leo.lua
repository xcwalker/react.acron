AddCSLuaFile()

local VehicleName = "Nissan Skyline (LEO)"

local A = "AMBER"
local R = "RED"
local DR = "D_RED"
local B = "BLUE"
local W = "WHITE"
local CW = "C_WHITE"
local SW = "S_WHITE"

local EMV = {}

EMV.Siren = 12
EMV.Skin = 0
EMV.Color = Color(56, 56, 56)

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

EMV.Selections = {{
    Name = "Lightbar",
    Options = {{
        Name = "None",
        Auto = {}
    }, {
        Name = "CHP Whelen Liberty SX",
        Auto = {13}
    }, {
        Name = "Code 3 RX2700",
        Auto = {14}
    }, {
        Name = "Code 3 Solex",
        Auto = {15}
    }, {
        Name = "Federal Signal Integrity",
        Auto = {16}
    }, {
        Name = "Federal Signal Legendc",
        Auto = {17}
    }, {
        Name = "Federal Signal Valor",
        Auto = {18}
    }, {
        Name = "Federal Signal Vision SLR",
        Auto = {19}
    }, {
        Name = "Feniex Avatar",
        Auto = {20}
    }, {
        Name = "Whelen Justice",
        Auto = {21}
    }}
    
}, {
    Name = "Position Markers",
    Options = {{
        Name = "Federal Signal MicroPulse",
        Auto = {1, 2, 3, 4, 5, 6, 7, 8}
    }, {
        Name = "Whelen Ion | Single Color",
        Auto = {22, 23, 24, 25, 26, 27, 28, 29}
    }, {
        Name = "Whelen Ion | Split",
        Auto = {30, 31, 32, 33, 34, 35, 36, 37}
    }, {
        Name = "None",
        Auto = {}
    }}
}, {
    Name = "Interior Lights [FRONT]",
    Options = {{
        Name = "TDM Front Interior Lightbar & Federal Signal Viper",
        Auto = {10, 11}
    }, {
        Name = "TDM Front Interior Lightbar",
        Auto = {11}
    }, {
        Name = "Federal Signal Viper",
        Auto = {10}
    }, {
        Name = "None",
        Auto = {}
    }}
}, {
    Name = "Interior Lights [REAR]",
    Options = {{
        Name = "Tomar 200S Rear Cali",
        Auto = {9}
    }, {
        Name = "None",
        Auto = {}
    }}
}, {
    Name = "Spotlight",
    Options = {{
        Name = "Whelen PAR-46 Spotlight",
        Auto = {12}
    }}
}}

-- Emergency Lights
EMV.Auto = { -- pos +right +front +up
{
    -- front - left
    ID = "Federal Signal MicroPulse",
    Scale = 1,
    Pos = Vector(-29.8, 96.3, 24.8),
    Ang = Angle(180, 5, 0),
    Phase = "S2",
    Color1 = "WHITE",
    Color2 = "BLUE"
}, {
    -- front - right
    ID = "Federal Signal MicroPulse",
    Scale = 1,
    Pos = Vector(29.8, 96.2, 26.7),
    Ang = Angle(0, -5, 0),
    Phase = "S2",
    Color1 = "WHITE",
    Color2 = "BLUE"
}, {
    -- rear - left
    ID = "Federal Signal MicroPulse",
    Scale = 0.75,
    Pos = Vector(9.5, -117, 28.8),
    Ang = Angle(85, 180, 0),
    Phase = "S2",
    Color1 = "RED",
    Color2 = "RED"
}, {
    -- rear - right
    ID = "Federal Signal MicroPulse",
    Scale = 0.75,
    Pos = Vector(-10.8, -117, 28.7),
    Ang = Angle(85, 0, 180),
    Phase = "S2",
    Color1 = "RED",
    Color2 = "RED"
}, {
    -- left - front
    ID = "Federal Signal MicroPulse",
    Scale = 1,
    Pos = Vector(-38.6, 90, 23.1),
    Ang = Angle(0, -271, 20),
    Phase = "S2",
    Color1 = "AMBER",
    Color2 = "RED"

}, {
    -- left - rear
    ID = "Federal Signal MicroPulse",
    Scale = 1,
    Pos = Vector(-37.8, -109.5, 26.5),
    Ang = Angle(0, -268, 20),
    Phase = "S2",
    Color1 = "AMBER",
    Color2 = "RED"
}, {
    -- right - front
    ID = "Federal Signal MicroPulse",
    Scale = 1,
    Pos = Vector(38.6, 88, 23.1),
    Ang = Angle(0, 271, 20),
    Phase = "S2",
    Color1 = "AMBER",
    Color2 = "RED"

}, {
    -- right - rear
    ID = "Federal Signal MicroPulse",
    Scale = 1,
    Pos = Vector(37.8, -112, 26.5),
    Ang = Angle(0, 268, 20),
    Phase = "S2",
    Color1 = "AMBER",
    Color2 = "RED"
}, {
    ID = "Tomar 200S Rear Cali",
    Scale = 0.8,
    Pos = Vector(0, -75, 49),
    Ang = Angle(0, 270, 0)
}, {
    ID = "Federal Signal Viper",
    Scale = 1,
    Pos = Vector(0, 28, 50),
    Ang = Angle(0, 90, 0)
}, {
    ID = "TDM Front Interior Lightbar",
    Scale = 1.1,
    Pos = Vector(0, 11, 62.2),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Whelen PAR-46 Spotlight",
    Scale = 0.8,
    Pos = Vector(-34, 23, 49),
    Ang = Angle(15, 125, -20)
}, {
    ID = "CHP Whelen Liberty SX",
    Scale = 1,
    Pos = Vector(0, -20, 70.25),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Code 3 RX2700",
    Scale = 1,
    Pos = Vector(0, -20, 70.25),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Code 3 Solex",
    Scale = 1,
    Pos = Vector(0, -20, 67.5),
    Ang = Angle(0, 0, 0)
}, {
    ID = "Federal Signal Integrity",
    Scale = 0.9,
    Pos = Vector(0, -20, 70.25),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Federal Signal Legend",
    Scale = 1,
    Pos = Vector(0, -20, 70.8),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Federal Signal Valor",
    Scale = 0.9,
    Pos = Vector(0, -20, 70.8),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Federal Signal Vision SLR",
    Scale = 0.95,
    Pos = Vector(0, -20, 70),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Feniex Avatar",
    Scale = 0.95,
    Pos = Vector(0, -20, 67.55),
    Ang = Angle(0, 90, 0)
}, {
    ID = "Whelen Justice",
    Scale = 1,
    Pos = Vector(0, -20, 72),
    Ang = Angle(0, 90, 0)
},
{
    -- front - left
    ID = "Whelen Ion",
    Scale = 1,
    Pos = Vector(-29.8, 96.3, 26.2),
    Ang = Angle(180, 5, 0),
    Phase = "A",
    Color1 = "WHITE"
}, {
    -- front - right
    ID = "Whelen Ion",
    Scale = 1,
    Pos = Vector(29.8, 96.2, 26.2),
    Ang = Angle(0, -5, 0),
    Phase = "B",
    Color1 = "WHITE"
}, {
    -- rear - left
    ID = "Whelen Ion",
    Scale = 0.75,
    Pos = Vector(9.5, -117, 29.2),
    Ang = Angle(85, 180, 0),
    Phase = "B",
    Color1 = "RED"
}, {
    -- rear - right
    ID = "Whelen Ion",
    Scale = 0.75,
    Pos = Vector(-10.8, -117, 29.2),
    Ang = Angle(85, 0, 180),
    Phase = "A",
    Color1 = "RED"
}, {
    -- left - front
    ID = "Whelen Ion",
    Scale = 1,
    Pos = Vector(-38.6, 90, 22.6),
    Ang = Angle(0, -271, 20),
    Phase = "B",
    Color1 = "AMBER"

}, {
    -- left - rear
    ID = "Whelen Ion",
    Scale = 1,
    Pos = Vector(-37.8, -109.5, 26),
    Ang = Angle(0, -268, 20),
    Phase = "A",
    Color1 = "AMBER"
}, {
    -- right - front
    ID = "Whelen Ion",
    Scale = 1,
    Pos = Vector(38.6, 88, 22.6),
    Ang = Angle(0, 271, 20),
    Phase = "B",
    Color1 = "AMBER"

}, {
    -- right - rear
    ID = "Whelen Ion",
    Scale = 1,
    Pos = Vector(37.8, -112, 26),
    Ang = Angle(0, 268, 20),
    Phase = "A",
    Color1 = "AMBER"
},
{
    -- front - left
    ID = "Whelen Ion Split",
    Scale = 1,
    Pos = Vector(-29.8, 96.3, 26.2),
    Ang = Angle(180, 5, 0),
    Color1 = "WHITE",
    Color2 = "BLUE"
}, {
    -- front - right
    ID = "Whelen Ion Split",
    Scale = 1,
    Pos = Vector(29.8, 96.2, 26.2),
    Ang = Angle(0, -5, 0),
    Color1 = "WHITE",
    Color2 = "BLUE"
}, {
    -- rear - left
    ID = "Whelen Ion Split",
    Scale = 0.75,
    Pos = Vector(9.5, -117, 29.2),
    Ang = Angle(85, 180, 0),
    Color1 = "RED",
    Color2 = "RED"
}, {
    -- rear - right
    ID = "Whelen Ion Split",
    Scale = 0.75,
    Pos = Vector(-10.8, -117, 29.2),
    Ang = Angle(85, 0, 180),
    Color1 = "RED",
    Color2 = "RED"
}, {
    -- left - front
    ID = "Whelen Ion Split",
    Scale = 1,
    Pos = Vector(-38.6, 90, 22.6),
    Ang = Angle(0, -271, 20),
    Color1 = "AMBER",
    Color2 = "RED"

}, {
    -- left - rear
    ID = "Whelen Ion Split",
    Scale = 1,
    Pos = Vector(-37.8, -109.5, 26),
    Ang = Angle(0, -268, 20),
    Color1 = "AMBER",
    Color2 = "RED"
}, {
    -- right - front
    ID = "Whelen Ion Split",
    Scale = 1,
    Pos = Vector(38.6, 88, 22.6),
    Ang = Angle(0, 271, 20),
    Color1 = "AMBER",
    Color2 = "RED"

}, {
    -- right - rear
    ID = "Whelen Ion Split",
    Scale = 1,
    Pos = Vector(37.8, -112, 26),
    Ang = Angle(0, 268, 20),
    Color1 = "AMBER",
    Color2 = "RED"
} }

-- Vehicle Lights
EMV.Meta = {
    spot = {
        AngleOffset = -90,
        W = 12,
        H = 12,
        Sprite = "sprites/emv/blank",
        Scale = 3,
        VisRadius = 16
    },
    head_low = {
        AngleOffset = -90,
        W = 12,
        H = 12,
        Sprite = "sprites/emv/blank",
        Scale = 2,
        VisRadius = 16
    },
    head_high = {
        AngleOffset = -90,
        W = 10,
        H = 10,
        Sprite = "sprites/emv/blank",
        Scale = 2,
        VisRadius = 16
    },
    brake = {
        AngleOffset = 90,
        W = 6,
        H = 14,
        Sprite = "sprites/emv/blank",
        Scale = 1.5,
        WMult = 1.2
    }
}

EMV.Positions = {
    [1] = {Vector(32, 93, 32), Angle(0, 0, 0), "head_low"},
    [2] = {Vector(-32, 93, 32), Angle(0, 0, 0), "head_low"},
    [3] = {Vector(24, 93, 31.5), Angle(0, 0, 0), "head_high"},
    [4] = {Vector(-24, 93, 31.5), Angle(0, 0, 0), "head_high"},
    [5] = {Vector(29, -114, 36), Angle(0, 0, 0), "brake"},
    [6] = {Vector(-29, -114, 36), Angle(0, 0, 0), "brake"},
    [7] = {Vector(-38, 30.5, 50.8), Angle(0, 0, 0), "spot"}
}

EMV.Sections = {
    ["low beams"] = {{{1, SW, 0.05}, {2, SW, 0.6}}, {{2, SW, 0.05}, {1, SW, 0.6}}, {{1, SW, 1}, {2, SW, 1}}, {{1, SW, 1}, {2, SW, 2}}, {{2, SW, 1}, {1, SW, 2}},},
    ["high beams"] = {{{3, SW, 0.05}, {4, SW, 0.6}}, {{4, SW, 0.05}, {3, SW, 0.6}}, {{3, SW, 1}, {4, SW, 1}}},
    ["brakes"] = {{{5, R, 2}, {6, R, 3}}, {{6, R, 2}, {5, R, 3}}, {{5, R, 2}, {6, R, 2}}}
}

EMV.Patterns = {
    ["low beams"] = {
        ["wigwag"] = {1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2},
        ["wigwag_pursuit"] = {4, 4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 4, 5, 5, 5, 5,},
        ["steady"] = {3}
    },
    ["high beams"] = {
        ["wigwag"] = {1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2},
        ["steady"] = {3}
    },
    ["brakes"] = {
        ["wigwag"] = {1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2},
        ["steady"] = {3}
    }
}

EMV.Sequences = {
    Sequences = {{
        Name = "ON SCENE",
        Stage = "M1",
        Components = {
            ["low beams"] = "steady",
            ["brakes"] = "steady"
        },
        Disconnect = {}
    }, {
        Name = "ENROUTE",
        Stage = "M2",
        Components = {
            ["low beams"] = "wigwag",
        },
        Disconnect = {}
    }, {
        Name = "PURSUIT",
        Stage = "M3",
        Components = {
            ["low beams"] = "wigwag_pursuit",
            ["brakes"] = "wigwag"
        },
        Disconnect = {}
    }},
    Traffic = {{
        Name = "LEFT",
        Stage = "L",
        Components = {},
        Disconnect = {}
    }, {
        Name = "DIVERGE",
        Stage = "D",
        Components = {},
        Disconnect = {}
    }, {
        Name = "RIGHT",
        Stage = "R",
        Components = {},
        Disconnect = {}
    }},
    Illumination = {{
        Name = "LAMP",
        Components = {{7, SW, 1}},
        Lights = {{Vector(-38, 30.5, 50.8), Angle(0, 90, -0), "lamp"}},
        Disconnect = {}
    }, {
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
    ["lamp"] = {
        Color = Color(200, 200, 200, 255),
        Texture = "effects/flashlight001",
        Near = 8,
        FOV = 80,
        Distance = 1300
    },
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
        Sprite = "sprites/emv/blank",
        Scale = 4,
        WMult = 1.2
    },
    head_low = {
        AngleOffset = -90,
        W = 8,
        H = 8,
        Sprite = "sprites/emv/blank",
        Scale = 1,
        VisRadius = 16
    },
    brake = {
        AngleOffset = 90,
        W = 6,
        H = 14,
        Sprite = "sprites/emv/blank",
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
    }
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
    [12] = {Vector(-38, 88, 32), Angle(0, 90, 0), "indicator"}
}

PI.States = {}

PI.States.Headlights = {}
PI.States.Brakes = {{5, R, 2}, {6, R, 2}, {7, R, 2}, {8, R, 2}}
PI.States.Blink_Left = {{6, R, 3}, {10, A, 1}, {12, A, 1}}
PI.States.Blink_Right = {{5, R, 3}, {9, A, 1}, {11, A, 1}}
PI.States.Reverse = {{3, SW, 1}, {4, SW, 1}}
PI.States.Running = {{1, SW, 1}, {2, SW, 1}, {5, R, 1}, {6, R, 1}}

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
list.Set("Vehicles", "xcw-nissan_skyline-leo", V)

if EMVU then
    EMVU:OverwriteIndex(VehicleName, EMV)
end
if Photon then
    Photon:OverwriteIndex(VehicleName, PI)
end
