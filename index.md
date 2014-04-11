---
layout: default
title: Home
---

## JSAV: {{ site.description }}

Documentation for v{{ site.version }}

<ul class="">
  <li>
    <a href="{{ site.baseurl }}/getstarted/">Getting Started</a>
  </li>
  <li class="subpages">
  {% comment %}Have to include manually, since the default ordering is quite dumb{% endcomment %}
    <ul class="">
      <li>
        <a href="{{ site.baseurl }}/getstarted/getjsav/">Downloading and Installing JSAV</a>
      </li>
      <li>
        <a href="{{ site.baseurl }}/getstarted/html/">Required Files and HTML</a>
      </li>
      <li>
        <a href="{{ site.baseurl }}/getstarted/creatingvisualization/">Creating A Visualization</a>
      </li>
      <li>
        <a href="{{ site.baseurl }}/getstarted/slideshows/">Creating A Slideshow</a>
      </li>
    </ul>
  </li>
  <li>
    <a href="{{ site.baseurl }}/datastructures/">Data Structures</a>
  </li>
  {% include toc-subpages.html pageurl='datastructures' %}
  <li>
    <a href="{{ site.baseurl }}/graphicalprimitives/">Graphical Primitives</a>
  </li>
  {% include toc-subpages.html pageurl='graphicalprimitives' %}
  <li>
    <a href="{{ site.baseurl }}/codeelements/">Code Elements</a>
  </li>
  {% include toc-subpages.html pageurl='codeelements' %}
  <li>
    <a href="{{ site.baseurl }}/commonfunctionality/">Common Functionality</a>
  </li>
  <li>
    <a href="{{ site.baseurl }}/otherapis/">Additional APIs</a>
  </li>
  {% include toc-subpages.html pageurl='otherapis' %}
  <li>
    <a href="{{ site.baseurl }}/exercises/">Creating Exercises</a>
  </li>
  {% include toc-subpages.html pageurl='exercises' %}
  <li>
    <a href="{{ site.baseurl }}/questions/">Showing Questions</a>
  </li>
</ul>

<p><a href="{{ site.github.repo }}">Project on GitHub</a></p>

### Publications
JSAV system paper:

 * Ville Karavirta, Clifford A. Shaffer (2013). JSAV: the JavaScript algorithm visualization library. In Proceedings of the 18th ACM conference on Innovation and technology in computer science education, pp. 159–164, New York, NY, USA.
   ([link](http://dl.acm.org/citation.cfm?id=2462487))

Articles discussing JSAV use:

 * Eric Fouh, Ville Karavirta, Daniel A. Breakiron, Sally Hamouda, Simin Hall, Thomas L. Naps, Clifford A. Shaffer (To Appear). Design and architecture of an interactive eTextbook – the OpenDSA system. Science of Computer Programming.
   ([link](http://www.sciencedirect.com/science/article/pii/S016764231300333X))
 * Ville Karavirta, Ari Korhonen, Otto Seppälä (2013). Misconceptions in Visual Algorithm Simulation Revisited: On UI's Effect on Student Performance, Attitudes and Misconceptions. In Learning and Teaching in Computing and Engineering (LaTiCE), 2013, pp. 62–69.
   ([link](http://dx.doi.org/10.1109/LaTiCE.2013.35))

### Presentations

<iframe src="http://www.slideshare.net/slideshow/embed_code/24154049" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px 1px 0; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

### JSAV in use
The [OpenDSA project](http://algoviz.org/OpenDSA/) uses JSAV in most of its content. You can, for example, take a look at the [sample book](http://algoviz.org/OpenDSA/Books/OpenDSA/html/).