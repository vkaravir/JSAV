This is the active working repository for the JSAV development library
for creating Algorithm Visualizations in JavaScript.

JSAV is a part of the OpenDSA project. OpenDSA aims to create a
complete hypertextbook for Data Structures and Algorithms along with
the necessary supporting infrastructure. For more information about
OpenDSA, see http://algoviz.org/forum/277.

This active JSAV repository is located at GitHub. A stable release
version will also be maintained at the OpenDSA repository, which
resides within the OpenAlgoViz project at SourceForge. The OpenDSA
SourceForge repository will also store the AVs that actually make use
of JSAV once we have progressed further in development.

For new developers:
* Install Git
* Check out the JSAV repository. For example, at the commandline you
  can do the following to create a new JSAV folder or directory:
    git clone git://github.com/vkaravir/JSAV.git JSAV
* Go to the JSAV folder or directory that you just created and run:
    make setup
  This will download all of the various standard development libraries
  needed by JSAV (but which are not stored in the repository), and
  "compiles" the pieces together for you. At this point, you are ready
  to try out the examples or invoke your copy of JSAV in your own
  development projects.

For SVN users new to git:
* To "checkout" a new copy of the library, use "git clone" instead of
  "svn checkout".
* To "update" your copy of the repository, use "git pull".
