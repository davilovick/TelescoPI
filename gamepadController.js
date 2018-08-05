var gamepad = require("gamepad");
gamepad.init()

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

class GamepadAxis
{
    constructor (axis, normalize, onValueChanged)
    {
        this.axis = axis;
        this.normalize = normalize;
        this.onValueChanged = onValueChanged;
    
        // Listen for move events on all gamepads
        gamepad.on("move", (id, gamePadAxis, value) => 
        {    
            if(this.axis == gamePadAxis)
            {            
                this.handleValueChanged(this, value)
            }
        });
    }

    handleValueChanged(self, newValue)
    {
        if (self.normalize)
        {
            newValue = ((newValue * 0.5) + 0.5);
        }

        self.onValueChanged(newValue);
    }

    shutDown()
    {
        gamepad.shutDown();
    }
}

class GamepadButton
{
    constructor (btnId, onPressed, onReleased)
    {
        this.btnId = btnId;
        this.onPressed = onPressed;
        this.onReleased = onReleased;
    
        // Listen for move events on all gamepads
        gamepad.on("down", (id, num) => 
        {    
            if(this.btnId == num)
            {            
                this.onPressed()
            }
        });

        gamepad.on("up", (id, num) => 
        {    
            if(this.btnId == num)
            {            
                this.onReleased()
            }
        });
    }

    shutDown()
    {
        gamepad.shutDown();
    }
}

module.exports = 
{
    GamepadAxis : GamepadAxis,
    GamepadButton : GamepadButton
}
 

 