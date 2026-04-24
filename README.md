# Super Scuffed Paint (SSP)
**WEB-115 Final Project Proposal**
Student: Jacob H | Repo: `SuperScuffedPaint`

---

## Overview

Super Scuffed Paint or SSP is a not so visually pleasing version of the MS PAINT we all know and love. Inside this site you will be able to draw on your own canvas and then save the images to your device. It will come with SOME features that MS Paint has (all be it scuffed). 

The target user is anyone who wants to have a little more creativity in their life while living on this large rock.
---

## Features

- Draw on a HTML Canvas element
- Ability to change pen settings like width and color
- Ability to add shapes (circles, squares, rectances)
- Ability to change the canvas size to a specified length/width
- Fill Bucket
- Current drawing will save using local storage along with settings (restart button will be in a settings menu to start over)

---

## Core Requirements Coverage

### If Statements & Loops

**Usage**: Check which tool is active; loop through pixels to fill areas.

```
IF currentTool == 'pen' THEN
  draw with pen
ELSE IF currentTool == 'circle' THEN
  draw circle
END IF

FOR each pixel in connected area DO
  change pixel color to fill color
END FOR
```

### Event Listeners

**Usage**: Detect user interactions on canvas and buttons.

```
ON mousedown at canvas:
  start drawing at position

ON mousemove at canvas:
  if drawing, draw line to new position

ON click at toolButton:
  change current tool

ON change at colorPicker:
  update pen color
```

### DOM Element Creation

**Usage**: Dynamically build toolbar and canvas elements.

```
CREATE canvas element
CREATE toolbar div
  CREATE button for each tool
  CREATE color picker input
  CREATE size slider input
APPEND all to page
```

### Classes & Subclasses

**Usage**: Create reusable tool objects with shared behavior.

```
CLASS Tool
  color, width, name

CLASS Pen extends Tool
  draw(startX, startY, endX, endY)

CLASS Circle extends Tool
  draw(centerX, centerY, radius)

CLASS Rectangle extends Tool
  draw(x, y, width, height)
```



---

## DLC — Additional Topics
### Local Storage
All of the users settings and current canvas  will be saved into local storage, using `JSON.stringify()` settings will be saved to `localStorage` after every change. On load, `JSON.parse()` restores the canvas exactly where the user left off with the same settings previously selected. This way the userwill be unable to lose progress (basically an autosave).

## Tech Stack

- HTML, CSS, Vanilla JavaScript
- `localStorage` for saving settings
- HTML Canvas for painting rendering
- VS Code + GitHub