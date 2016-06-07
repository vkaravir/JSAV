---
layout: page
title: Showing Questions
---

Interactive questions can be initialized with the ```question```
function of a JSAV instance.

<h3 class="apimethod">.question(qtype, questionText, [options])</h3>
This is a method of the AV object. It initializes an interactive question
of the given type (```qtype```). The type can be:

 * ```TF``` for a true-false type question
 * ```MC``` for a multiple-choice question where only one answer can be selected
 * ```MS``` for a multiple-select question where multiple answers can be selected and be correct

The ```questionText``` parameter is the actual question shown to a student. For the question type TF, ```options``` parameter can contain following options.

 * ```{trueLabel: <string>}``` The label shown for true option. Only for type TF. Default value ```True```.
 * ```{falseLabel: <string>}``` The label shown for false option. Only for type TF. Default value ```False```.
 * ```{correct: <boolean>}``` The correct answer, true or false.

An example of initializing a true-false question is below.

{% highlight javascript %}
var q = av.question("TF", "JSAV supports questions now?",
                    {correct: true,
                    falseLabel: "No",
                    trueLabel: "Yes"});
{% endhighlight %}

The function returns an instance of a question. Answer choices can be added
to this instance using the following methods.

<h3 class="apimethod">q.addChoice(label, [options])</h3>
This adds an answer choice to question ```q```. Parameter ```label``` is the label shown for this answer choice.
The only option at the moment is ```correct``` which indicates the correctness of this choice. Default value for it
is ```false```. Note, that this method does nothing for the true-false type question.

<h3 class="apimethod">q.show()</h3>
This function will show the question in the current step in the algorithm. This way, the initialization, addition of answers, and displaying the question can happen in different steps in the animation. It helps when the goal is to show students questions that require prediction of the algorithm's behavior.
A complete example of a multiple-select question:

{% highlight javascript %}
var q = av.question("MS", "Life is good?");
q.addChoice("Of course", {correct: true});
q.addChoice("Certainly", {correct: true});
q.addChoice("No way!");
q.show();
{% endhighlight %}
