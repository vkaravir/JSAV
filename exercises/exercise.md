---
layout: subpage
title: Exercise API
---

The exercise API is used to create interactive, automatically assessed exercises.

<h3 class="apimethod">.exercise(modelSolution, reset, compare, options)</h3>
An exercise is 
initialized with a call to ```av.exercise(..)```. The parameters for the function are:

 * ```{modelSolution: <function>}``` The function to generate the model solution. The function has to return the data structures and/or variables used in grading of the exercise. The return value can be a single data structure or an array of structures.
 * ```{reset: <function>}``` The initialization function that resets the exercise. The function has to return the data structures and/or variables used in grading of the exercise. The return value can be a single data structure or an array of structures.
 * ```{compare: <Object or Array>}``` Specifies which properties to compare for the structures. In the example below, we set the comparison to be CSS property background-color so grading would check if the structures have same background color (that is, if they are highlighted).

The function can also take several options, some of which are required. The full set of options are: 

 * ```{feedback: <string>}``` Will change the feedback mode, possible values continuous and atend (default). See Continuous feedback below.
 * ```{fixmode: <string>}``` Change the behavior in continuous mode, possible values are undo and fix. The default is undo.
 * ```{feedbackSelectable: <boolean>}``` The settings dialog will not, by default, allow student to change the feedback mode. Setting this option to true enables this choice.
 * ```{fixmodeSelectable: <boolean>}``` The settings dialog will not, by default, allow student to change the behavior in continuous feedback mode. Setting this option to true enables this choice.
 * ```{fix: <function}``` A function that will fix the student's solution to match the current step in model solution. Before this function is called, the previous incorrect step in student's solution is undone. The function gets the model structures as a parameter. For an example, see the examples/ShellsortProficiency.html.
 * ```{showGrade}: <function>}``` A function that can be used to customize the way the grade is shown. The function will be added to the exercise and can be called with ```exercise.showGrade```. The function can access the grade information from attribute ```this.score```. Example content of that attribute: ```{total: 15, correct: 3, undo: 0, fix: 0, student: 5}```. Total is the total number of steps in the model solution, student the number of steps in student solution, and correct the number of correct steps. Values undo and fix show how many steps were undone/fixed in the continuous feedback mode. Note, that to make sure the grading is up to date, this function should call the ```grade``` function of the exercise before showing the grade.
 * ```{modelDialog: <object>}``` An object that can specify options for the model answer dialog. For
    the possible options, see the documentation for the JSAV.utils.dialog.
 * ```{controls: <DOMElement or jQuery Object>``` An HTML element inside which the control buttons (reset, undo etc.) are added.
 * ```{debug: <boolean>}``` If true, print out some debug information for exercise developers.
    Mainly, the continuous feedback mode will log possible errors in the fix function.
 * ```{resetButtonTitle: <string>}``` Change the text on the reset button. Defaults to "Reset".
 * ```{undoButtonTitle: <string>}``` Change the text on the undo button. Defaults to "Undo".
 * ```{modelButtonTitle: <string>}``` Change the text on the model answer button. Defaults to "Model Answer".
 * ```{gradeButtonTitle: <string>}``` Change the text on the grade button. Defaults to "Grade".

For example, assuming ```modelSolution``` and ```reset``` are functions, the following would initialize an exercise:

{% highlight javascript %}
var exercise = av.exercise(modelSolution, reset, { css: "background-color" });
exercise.reset();
{% endhighlight %}

See also the [tutorial on creating an exercise](../tutorial-exercise/).

<h3 class="apimethod">exercise.showGrade()</h3>
Shows the grade of the student's current solution. The behaviour can be customized using the ```showGrade``` option when initializing the exercise.

<h3 class="apimethod">exercise.reset()</h3>
Resets the exercise.

<h3 class="apimethod">exercise.showModelAnswer()</h3>
Shows the model answer of the exercise.

<h3 class="apimethod">exercise.gradeableStep()</h3>
Marks the current step in the student's solution as a step used in grading.

### Showing the Current Score and Maximum Score in Continuous Feedback Mode

If the exercise is in the continuous feedback mode, it is possible to have JSAV show
the current score, current maximum score, and the total maximum score to student.
This can be done by adding HTML elements <em>inside</em> the JSAV container elements.
JSAV will search for elements with the following class attributes:

 * ```jsavcurrentscore```: Inside this element, JSAv will update the current 
    score achieved by the student.
 * ```jsavcurrentmaxscore```: The contents of this element will be updated to
    contain the maximum score thus far in the exercise.
 * ```jsavmaxscore```: The maximum score available in this exercise.

So you could use the following HTML:

{% highlight html %}
<p>
  Your current score is <span class="jsavcurrentscore"></span> of
  <span class="jsavcurrentmaxscore"></span>. Maximum score in this exercise is
  <span class="jsavmaxscore"></span>.
</p>
{% endhighlight %}

As a shorter convenience notation, you can use ```<p class="jsavscore"><p/>```
that will be replaced automatically by JSAV with the HTML above if the exercise is
in continuous feedback mode. Note, that in both cases, the elements can be anything, the
important thing is that they have the ```class``` attributes.