export interface CommandParameter {
	name: string;
	type: 'number' | 'string' | 'boolean';
	required: boolean;
	default?: string | number | boolean;
  }
  
  export interface CommandMetadata {
	name: string;
	aliases: string[];
	parameters: CommandParameter[];
	category: 'movement' | 'drawing' | 'visual' | 'appearance' | 'programmatic' | 'custom';
	descriptionKey: string;
	examples: string[];
  }
  
  export interface CommandRegistry {
	[commandName: string]: CommandMetadata;
  }
  

// Commenting out commands that are not needed for now.
export const commandRegistry: CommandRegistry = {
  // Movement commands
  forward: {
    name: 'forward',
    aliases: ['fd', 'move'],
    parameters: [
      { name: 'steps', type: 'number', required: true }
    ],
    category: 'movement',
    descriptionKey: 'commands.forward.description',
    examples: ['forward(100)', 'fd(50)', 'forward(200)']
  },
  

//   move: {
//     name: 'move',
//     aliases: ['forward', 'fd'],
//     parameters: [
//       { name: 'steps', type: 'number', required: true }
//     ],
//     category: 'movement',
//     descriptionKey: 'commands.forward.description',
//     examples: ['move(100)', 'move(75)']
//   },

  back: {
    name: 'back',
    aliases: ['bk'],
    parameters: [
      { name: 'steps', type: 'number', required: true }
    ],
    category: 'movement',
    descriptionKey: 'commands.back.description',
    examples: ['back(100)', 'bk(50)']
  },

  

  left: {
    name: 'left',
    aliases: ['lt'],
    parameters: [
      { name: 'degrees', type: 'number', required: true }
    ],
    category: 'movement',
    descriptionKey: 'commands.left.description',
    examples: ['left(90)', 'lt(45)', 'left(180)']
  },


  right: {
    name: 'right',
    aliases: ['rt'],
    parameters: [
      { name: 'degrees', type: 'number', required: true }
    ],
    category: 'movement',
    descriptionKey: 'commands.right.description',
    examples: ['right(90)', 'rt(45)', 'right(180)']
  },


  turn: {
    name: 'turn',
    aliases: [],
    parameters: [
      { name: 'degrees', type: 'number', required: true }
    ],
    category: 'movement',
    descriptionKey: 'commands.turn.description',
    examples: ['turn(90)', 'turn(-45)', 'turn(180)']
  },

  arc: {
    name: 'arc',
    aliases: [],
    parameters: [
      { name: 'radius', type: 'number', required: true },
      { name: 'angle', type: 'number', required: true },
      { name: 'counterclockwise', type: 'boolean', required: false, default: false }
    ],
    category: 'movement',
    descriptionKey: 'commands.arc.description',
    examples: ['arc(50, 90)', 'arc(100, 180)', 'arc(30, 45, true)']
  },

//   start: {
//     name: 'start',
//     aliases: [],
//     parameters: [],
//     category: 'programmatic',
//     descriptionKey: 'commands.start.description',
//     examples: ['start()']
//   },

  // Drawing commands
  penDown: {
    name: 'penDown',
    aliases: [],
    parameters: [],
    category: 'drawing',
    descriptionKey: 'commands.penDown.description',
    examples: ['penDown()']
  },

  penUp: {
    name: 'penUp',
    aliases: [],
    parameters: [],
    category: 'drawing',
    descriptionKey: 'commands.penUp.description',
    examples: ['penUp()']
  },

  beginPath: {
    name: 'beginPath',
    aliases: [],
    parameters: [],
    category: 'drawing',
    descriptionKey: 'commands.beginPath.description',
    examples: ['beginPath()']
  },

  closePath: {
    name: 'closePath',
    aliases: [],
    parameters: [],
    category: 'drawing',
    descriptionKey: 'commands.closePath.description',
    examples: ['closePath()']
  },

  stroke: {
    name: 'stroke',
    aliases: [],
    parameters: [],
    category: 'drawing',
    descriptionKey: 'commands.stroke.description',
    examples: ['stroke()']
  },

  fill: {
    name: 'fill',
    aliases: [],
    parameters: [],
    category: 'drawing',
    descriptionKey: 'commands.fill.description',
    examples: ['fill()']
  },

  fillText: {
    name: 'fillText',
    aliases: [],
    parameters: [
      { name: 'text', type: 'string', required: true }
    ],
    category: 'drawing',
    descriptionKey: 'commands.fillText.description',
    examples: ['fillText("Hello")', 'fillText("My Drawing")']
  },

  strokeText: {
    name: 'strokeText',
    aliases: [],
    parameters: [
      { name: 'text', type: 'string', required: true }
    ],
    category: 'drawing',
    descriptionKey: 'commands.strokeText.description',
    examples: ['strokeText("Hello")', 'strokeText("Outline Text")']
  },

  // Visual parameter commands
  setStrokeStyle: {
    name: 'setStrokeStyle',
    aliases: [],
    parameters: [
      { name: 'style', type: 'string', required: true }
    ],
    category: 'visual',
    descriptionKey: 'commands.setStrokeStyle.description',
    examples: ['setStrokeStyle("red")', 'setStrokeStyle("#00FF00")', 'setStrokeStyle("blue")']
  },

//   setStrokeColorRGB: {
//     name: 'setStrokeColorRGB',
//     aliases: [],
//     parameters: [
//       { name: 'r', type: 'number', required: true },
//       { name: 'g', type: 'number', required: true },
//       { name: 'b', type: 'number', required: true }
//     ],
//     category: 'visual',
//     descriptionKey: 'commands.setStrokeColorRGB.description',
//     examples: ['setStrokeColorRGB(255, 0, 0)', 'setStrokeColorRGB(0, 255, 0)', 'setStrokeColorRGB(0, 0, 255)']
//   },

//   setStrokeColorHSL: {
//     name: 'setStrokeColorHSL',
//     aliases: [],
//     parameters: [
//       { name: 'h', type: 'number', required: true },
//       { name: 's', type: 'number', required: true },
//       { name: 'l', type: 'number', required: true }
//     ],
//     category: 'visual',
//     descriptionKey: 'commands.setStrokeColorHSL.description',
//     examples: ['setStrokeColorHSL(0, 100, 50)', 'setStrokeColorHSL(120, 100, 50)', 'setStrokeColorHSL(240, 100, 50)']
//   },

  setFillStyle: {
    name: 'setFillStyle',
    aliases: [],
    parameters: [
      { name: 'style', type: 'string', required: true }
    ],
    category: 'visual',
    descriptionKey: 'commands.setFillStyle.description',
    examples: ['setFillStyle("red")', 'setFillStyle("#00FF00")', 'setFillStyle("blue")']
  },

  setLineWidth: {
    name: 'setLineWidth',
    aliases: [],
    parameters: [
      { name: 'width', type: 'number', required: true }
    ],
    category: 'visual',
    descriptionKey: 'commands.setLineWidth.description',
    examples: ['setLineWidth(5)', 'setLineWidth(10)', 'setLineWidth(1)']
  },

  setLineCap: {
    name: 'setLineCap',
    aliases: [],
    parameters: [
      { name: 'style', type: 'string', required: true }
    ],
    category: 'visual',
    descriptionKey: 'commands.setLineCap.description',
    examples: ['setLineCap("round")', 'setLineCap("square")', 'setLineCap("butt")']
  },

  setFont: {
    name: 'setFont',
    aliases: [],
    parameters: [
      { name: 'font', type: 'string', required: true }
    ],
    category: 'visual',
    descriptionKey: 'commands.setFont.description',
    examples: ['setFont("20px Arial")', 'setFont("bold 16px serif")', 'setFont("italic 24px sans-serif")']
  },

  setTextAlign: {
    name: 'setTextAlign',
    aliases: [],
    parameters: [
      { name: 'align', type: 'string', required: true }
    ],
    category: 'visual',
    descriptionKey: 'commands.setTextAlign.description',
    examples: ['setTextAlign("center")', 'setTextAlign("left")', 'setTextAlign("right")']
  },

  setTextBaseline: {
    name: 'setTextBaseline',
    aliases: [],
    parameters: [
      { name: 'baseline', type: 'string', required: true }
    ],
    category: 'visual',
    descriptionKey: 'commands.setTextBaseline.description',
    examples: ['setTextBaseline("middle")', 'setTextBaseline("top")', 'setTextBaseline("bottom")']
  },

  // Turtle appearance and behavior
  setPosition: {
    name: 'setPosition',
    aliases: [],
    parameters: [
      { name: 'x', type: 'number', required: true },
      { name: 'y', type: 'number', required: true }
    ],
    category: 'appearance',
    descriptionKey: 'commands.setPosition.description',
    examples: ['setPosition(100, 100)', 'setPosition(0, 0)', 'setPosition(400, 200)']
  },

  setSpeed: {
    name: 'setSpeed',
    aliases: [],
    parameters: [
      { name: 'speed', type: 'number', required: true }
    ],
    category: 'appearance',
    descriptionKey: 'commands.setSpeed.description',
    examples: ['setSpeed(1)', 'setSpeed(5)', 'setSpeed(10)']
  },

  setSize: {
    name: 'setSize',
    aliases: [],
    parameters: [
      { name: 'size', type: 'number', required: true }
    ],
    category: 'appearance',
    descriptionKey: 'commands.setSize.description',
    examples: ['setSize(50)', 'setSize(25)', 'setSize(100)']
  },

//   setImage: {
//     name: 'setImage',
//     aliases: [],
//     parameters: [
//       { name: 'url', type: 'string', required: true }
//     ],
//     category: 'appearance',
//     descriptionKey: 'commands.setImage.description',
//     examples: ['setImage("./turtle.png")', 'setImage("./my-turtle.gif")']
//   },

//   setIcon: {
//     name: 'setIcon',
//     aliases: [],
//     parameters: [
//       { name: 'icon', type: 'string', required: true }
//     ],
//     category: 'appearance',
//     descriptionKey: 'commands.setIcon.description',
//     examples: ['setIcon("🐢")', 'setIcon("⭐")', 'setIcon("🚀")']
//   },

  // Programmatic functions
  sleep: {
    name: 'sleep',
    aliases: [],
    parameters: [
      { name: 'milliseconds', type: 'number', required: true }
    ],
    category: 'movement',
    descriptionKey: 'commands.sleep.description',
    examples: ['sleep(1000)', 'sleep(500)', 'sleep(2000)']
  },

//   eval: {
//     name: 'eval',
//     aliases: [],
//     parameters: [
//       { name: 'func', type: 'string', required: true }
//     ],
//     category: 'programmatic',
//     descriptionKey: 'commands.eval.description',
//     examples: ['eval("console.log(\'Hello\')")']
//   },

  // Custom functions
  hide: {
    name: 'hide',
    aliases: [],
    parameters: [],
    category: 'appearance',
    descriptionKey: 'commands.hide.description',
    examples: ['hide()']
  },

  show: {
    name: 'show',
    aliases: [],
    parameters: [],
    category: 'appearance',
    descriptionKey: 'commands.show.description',
    examples: ['show()']
  }
}; 