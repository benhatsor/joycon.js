
let Gamepad = {
  
  // event listeners
  'listeners': {},
  
  // controllers
  'controller': {},
  
  // controller utility functions
  'controllers': {
    
    'on': {
      
      // a, b, x, y, left-shoulder, right-shoulder, left-trigger, right-trigger, select, start, left-joystick, right-joystick, dpad-up, dpad-down, dpad-left, dpad-right, home, share
      'press': (key, callback) => {
        
        Gamepad.listeners[key] = {
          callback: callback,
          lastValue: 0
        };
        
      },
      
      // left-joystick, right-joystick
      'move': (key, callback) => {
        
        Gamepad.listeners[key + '-move'] = {
          callback: callback,
          lastValue: {
            x: 0,
            y: 0
          }
        };
        
      },
      
      
      'connect': (callback) => {
        
        Gamepad.listeners['controller-connect'] = {
          callback: callback
        };
                
      },
      
      'disconnect': (callback) => {
        
        Gamepad.listeners['controller-disconnect'] = {
          callback: callback
        };
                
      }
      
    },
    
    // remove the listener for move events
    // by adding '-move' to the event name, eg.
    // left-joystick-move
    'removeListener': (name) => {
      
      delete Gamepad.listeners[name];
      
    },
    
    // intensity:
    // { preset } or { mildMotorIntensity, strongMotorIntensity }
    // presets:
    // 'mild', 'medium', 'strong'
    'vibrate': async (intensity, duration) => {
      
      // if chosen a preset
      if (intensity.preset) {
        
        // load preset
        const presets = Gamepad.controllers.vibrationPresets;
        const preset = presets[intensity.preset];
        
        intensity = preset;
        
      }
      
      // parse vibration options
      const vibrationOptions = {
        duration: duration,
        strongMagnitude: intensity.strongMotorIntensity,
        weakMagnitude: intensity.mildMotorIntensity
      };
      
      
      // vibrate all controllers
      
      const controllers = Object.values(Gamepad.controller);
      
      controllers.forEach(controller => {
              
        const vibrationMotor = controller.vibrationActuator;
        
        if (vibrationMotor) {
          
          // vibrate
          vibrationMotor.playEffect('dual-rumble', vibrationOptions);
          
        }
        
      });
      
      // await vibration end
      await new Promise((resolve) => {
        window.setTimeout(resolve, duration);
      });
      
    },
    
    'vibrationPresets': {

      mild: {
        strongMotorIntensity: 0,
        mildMotorIntensity: 0.07
      },

      medium: {
        strongMotorIntensity: 0,
        mildMotorIntensity: 0.14
      },

      strong: {
        strongMotorIntensity: 1,
        mildMotorIntensity: 1
      }

    }
    
  },
  
  'update': () => {
    
    Gamepad.updateControllers();
    
    
    const buttonMap = Gamepad.buttonMap;
    const axisMap = Gamepad.axisMap;
    
    const controllers = Object.values(Gamepad.controller);
    
    controllers.forEach(controller => {
      
      const buttons = controller.buttons;
      
      buttons.forEach((button, index) => {
        
        const buttonName = buttonMap[index];
        
        const buttonListener = Gamepad.listeners[buttonName];
        
        // if button listener exists
        if (buttonListener) {
          
          // if the button's value changed
          if (button.value !== buttonListener.lastValue) {
            
            buttonListener.lastValue = button.value;
            
            // call button listener with button value
            buttonListener.callback(button.value);
            
          }

        }
        
      });
      
      
      const axesObj = controller.axes;
      let axes = {};
      
      // map axes to object
      axesObj.forEach((axisValue, index) => {
        
        const axis = axisMap[index][0];
        const axisName = axisMap[index][1];
        
        if (!axes[axisName]) axes[axisName] = {};
        axes[axisName][axis] = axisValue;
        
      });
      
      // run on all axes
      Object.keys(axes).forEach(axisName => {
        
        const axisListener = Gamepad.listeners[axisName];
        
        // if axis listener exists
        if (axisListener) {
          
          const axisObj = axes[axisName];
          
          // if the axis' value changed
          if (axisObj.x !== axisListener.lastValue.x ||
              axisObj.y !== axisListener.lastValue.y) {
            
            axisListener.lastValue = axisObj;
            
            // call axis listener with axis value
            axisListener.callback({
              x: axisObj.x,
              y: axisObj.y
            });
            
          }

        }
        
      });
      
    });
    
    
    // if controllers are connected
    if (Object.keys(Gamepad.controller).length
         !== 0) {
      
      // update
      Gamepad.onNextFrame(Gamepad.update);
      
    }
    
  },
  
  'updateControllers': () => {
    
    const controllers = navigator.getGamepads();
    
    controllers.forEach(controller => {
      
      if (controller && controller.index !== undefined) {
        
        Gamepad.controller[controller.index] = controller;
        
      }
      
    });
    
  },
  
  'addListeners': () => {
    
    window.addEventListener('gamepadconnected', (e) => {
      
      Gamepad.controller[e.gamepad.index] = e.gamepad;
      
      Gamepad.onNextFrame(Gamepad.update);
      
      
      const controllerListener = Gamepad.listeners['controller-connect'];
      
      // if controller listener exists
      if (controllerListener) {
        
        // call controller listener
        controllerListener.callback(e.gamepad);
        
      }
      
    });
    
    window.addEventListener('gamepaddisconnected', (e) => {
      
      delete Gamepad.controller[e.gamepad.index];
      
      
      const controllerListener = Gamepad.listeners['controller-disconnect'];
      
      // if controller listener exists
      if (controllerListener) {
        
        // call controller listener
        controllerListener.callback(e.gamepad);
        
      }
      
    });
    
  },
  
  'onNextFrame': (callback) => {
    window.requestAnimationFrame(callback);
  },
  
  'buttonMap': {
    0: 'a',
    1: 'b',
    2: 'x',
    3: 'y',
    4: 'left-shoulder',
    5: 'right-shoulder',
    6: 'left-trigger',
    7: 'right-trigger',
    8: 'select',
    9: 'start',
    10: 'left-joystick',
    11: 'right-joystick',
    12: 'dpad-up',
    13: 'dpad-down',
    14: 'dpad-left',
    15: 'dpad-right',
    16: 'home',
    17: 'share'
  },
  
  'axisMap': {
    0: ['x', 'left-joystick-move'],
    1: ['y', 'left-joystick-move'],
    2: ['x', 'right-joystick-move'],
    3: ['y', 'right-joystick-move'],
  }
  
};

Gamepad.addListeners();
