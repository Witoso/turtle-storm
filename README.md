# Turtle Storm ⚡️🐢⚡️

A modern, browser-based turtle graphics programming environment designed for learning programming with kids. Built with vanilla JavaScript, web components, and the latest web APIs.

## 🎯 What is Turtle Storm?

Turtle Storm is an interactive programming environment that combines the classic turtle graphics concept with modern web technologies. It's designed to make learning programming fun and accessible, especially for children. The turtle (a small robot on screen) follows your commands to draw shapes, patterns, and create art.

## 🌐 Live Demo

Try Turtle Storm online at: **[turtle-storm.mesaverse.xyz](https://turtle-storm.mesaverse.xyz)**

## ✨ Features

### 🐢 Turtle Graphics
- **Movement Commands**: `forward()`, `back()`, `left()`, `right()`, `turn()`, `arc()`
- **Drawing Commands**: `penDown()`, `penUp()`, `beginPath()`, `closePath()`, `stroke()`, `fill()`
- **Text Drawing**: `fillText()`, `strokeText()`
- **Visual Customization**: Colors, line width, fonts, and more

### 🎨 Visual Features
- **Real-time Drawing**: Watch the turtle move and draw in real-time
- **High DPI Support**: Crisp graphics on high-resolution displays
- **Customizable Turtle**: Change size, speed, and appearance
- **Color Support**: RGB, HSL, and named color support

### 🌍 Internationalization
- **Multi-language Support**: English and Polish interfaces
- **Localized Commands**: All commands and descriptions in multiple languages
## 📚 How to Use

### Basic Commands

Start with simple movement commands:

```javascript
forward(100)    // Move forward 100 steps
right(90)       // Turn right 90 degrees
left(45)        // Turn left 45 degrees
back(50)        // Move backward 50 steps
```

### Drawing Shapes

**Square:**
```javascript
penDown()
forward(100)
right(90)
forward(100)
right(90)
forward(100)
right(90)
forward(100)
```

**Circle:**
```javascript
penDown()
arc(50, 360)    // Draw a circle with radius 50
```

### Colors and Styling

```javascript
setStrokeStyle("red")     // Set line color to red
setLineWidth(5)          // Set line width to 5 pixels
setFillStyle("blue")     // Set fill color to blue
```

### Text Drawing

```javascript
setFont("20px Arial")
fillText("Hello Turtle!")
```
## 🎓 Learning Resources

### For Kids
- Start with simple shapes (squares, triangles)
- Experiment with colors and sizes
- Try creating patterns and designs
- Use the command history to see what you've done

### For Educators
- Use the command list to explore available commands
- Switch between languages for multilingual classrooms
- Use the reset button to start fresh
- Encourage experimentation with parameters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Real Turtle](https://github.com/real-turtle/real-turtle) library
- Styled with [Pico CSS](https://picocss.com/)
- Built with [Vite](https://vitejs.dev/)
- Tested with [Vitest](https://vitest.dev/)

---

**Happy coding with Turtle Storm! 🐢⚡️** 