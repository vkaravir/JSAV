---
layout: subpage
title: Pointer API
---

Pointers can be used to represent pointers of a programming language. The pointer is
  visualized as a label with an arrow to the target of the pointer.

<h3 class="apimethod">.pointer(name, target, [options])</h3>

This is a method of the AV object. It creates a pointer that points to some JSAV object.
Parameter ```name``` is the (initial) name for the pointer. Parameter ```options``` include the following:

 * ```{left/top/right/bottom: <lengthUnit>}``` Values to determine the absolute position of the label relative to the pointer's target.
 * ```{anchor: <String>}``` Defines which position on the element being positioned to align with the target element. Should be in 
  format ```horizontal vertical```. Possible horizontal values are "left", "center", "right" and vertical values "top", "center", "bottom". Defaults to ```center center```.
 * ```{myAnchor: <String>}``` Similar to anchor, but the position on this element. Defaults to ```center center```.
 * ```{targetIndex: < Number>}``` If target is a JSAV array, this option can be used to target
  an index in that array. Note, that it is better to simply pass the index as the ```target``` parameter to the constructor. You
  can get the index with the ```array.index(ind)``` function.
 * ```{fixed: <boolean>}``` A boolean indicating whether the pointer should move when it's target changes.
  Note, that if the pointer has a target when initialized, the pointer will still be positioned
  relative to that target.

A pointer instance has the functions of the Label object as well as the following functions.

<h3 class="apimethod">.target([newTarget], [options])</h3>

If ```newTarget``` is not specified, returns the JSAV object this pointer points to. If
  ```newTarget``` is a JSAV object, the pointer will be updated to point to that structure.
  Valid ```options``` are the same as for the pointer constructor. If setting a new target,
  the change is recorded in the animation and the function returns the pointer object.

**Note:** the position of the pointer is only updated once the ```jsav.step()```,
  ```jsav.displayInit()```, or ```jsav.recorded()``` function is called.
