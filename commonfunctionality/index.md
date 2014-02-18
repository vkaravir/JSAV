---
layout: page
title: Common Functionality
---

Many JSAV objects share common options and functions. These are explained below.

**Note:** This list is still largely unwritten and the options are listed with the JSAV objects as well.

## Common Options

 *  ```{visible: <boolean>}``` Determine whether the object is visible on creation. Defaults to true.
 * ***{element: <DOM Element>}``` The DOM element inside which the JSAV object's elements should be added. This should
   be either a DOM Element or a jQuery object for a single element.


### Positioning Options

JSAV has multiple ways to position objects. The options available are listed below.

 * center: Boolean to determine if the object should be automatically centered within its container. Defaults to true.
 * left/top/right/bottom: Values to determine the absolute position of the object within its container.
 * relativeTo: A JSAV data structure object or DOM element that this object should be positioned relative to. If this option is specified, left and top options will change structure's position relative to the relativeTo element. Note, that the element pointed by relativeTo needs to be visible.
 * anchor: Defines which position on the element being positioned to align with the target element. Should be in format horizontal vertical. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to center center. Only has an effect if relativeTo is specified.
 * myAnchor: Similar to anchor, but the position on this element. Defaults to center center. Only has an effect if relativeTo is specified.
 * follow: A boolean indicating whether or not this structure should move when the relative element moves. Only
    has an effect if relativeTo is specified.
 * relativeIndex: If relativeTo points to a JSAV array, this option can be used to position this structure relative to an index in that array. Only has an effect if relativeTo is specified.
