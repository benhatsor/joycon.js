# <img src="icon.svg" width="30px"> Joycon.js

Add controller functionality to your JavaScript game.

- Supports PlayStation, Xbox, Switch, etc.
- [Really simple API.](#api)
- [~2.5KB minified.](/Joycon.min.js)
- Vibration support.

# Get it

Add this line to the `<body>`:
```HTML
<script src="https://cdn.cde.run/Joycon.min.js"></script>
```

Here's a [demo.](https://cde.run/barhatsor/joycon.js/demo.html)

# API

## Buttons

```JS
const controllers = Joycon.controllers;

controllers.on.press('start', (value) => {

  console.log('pressed start!', value); // value is 0 to 1

});
```

Button can be `a`, `b`, `x`, `y`, `start`, `left-trigger`, etc. ([full list below](#button-list))

## Joystick

```JS
const controllers = Joycon.controllers;

controllers.on.move('left-joystick', (value) => {

  console.log('moved left joystick!', value.x, value.y); // value is -1 to 1 down/right

});
```
Also `right-joystick`.

## Controller connected

```JS
const controllers = Joycon.controllers;

controllers.on.connect((controller) => {

  console.log('controller connected!', controller);

});

controllers.on.disconnect((controller) => {

  console.log('controller disconnected!', controller);

});
```

## Vibrate

```JS
const controllers = Joycon.controllers;

// preset can be mild, medium or strong
controllers.vibrate({ preset: 'medium' }, 250); // -> time in ms

// or you can choose your own values
controllers.vibrate({
  mildMotorIntensity: 0.5,
  strongMotorIntensity: 0.5
}, 250);
```

## Remove a listener

```JS
const controllers = Joycon.controllers;

controllers.removeListener('left-trigger');
```

Remove Joystick `move` events with `left-joystick-move`.  
Remove controller `connect` events with `controller-connect`.

# Button list

[See above](#buttons) on how to use these.

| Buttons: |  |  |  |  |
|---|---|---|---|---|
| a | left-shoulder | select | dpad-up | home |
| b | right-shoulder | start | dpad-down | share |
| x | left-trigger | left-joystick | dpad-left |
| y | right-trigger | right-joystick | dpad-right |

# License

[MIT](/LICENSE)

---

Thanks for coming by! <3
