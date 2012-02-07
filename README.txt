This is the JSAV development library for creating Algorithm
Visualizations in JavaScript.

JSAV is a part of the OpenDSA project. OpenDSA aims to create a
complete hypertextbook for Data Structures and Algorithms along with
the necessary supporting infrastructure. For more information about
OpenDSA, see http://algoviz.org/ebook .

JSAV and OpenDSA are released under the MIT license. See the file
MIT-license.txt included with this distribution.

The official "stable release" versions of JSAV are maintained as part
of the OpenAlgoViz project at SourceForge. The OpenDSA SourceForge
repository also stores the AVs that actually make use of JSAV. These
materials are available by checking out:
svn co https://openalgoviz.svn.sourceforge.net/svnroot/openalgoviz/OpenDSA OpenDSA

The day-to-day working JSAV repository is located at GitHub. For new
developers who want to use the Github working version of JSAV:
* Install Git
* Check out the JSAV repository. For example, at the commandline you
  can do the following to create a new JSAV folder or directory:
    git clone git://github.com/vkaravir/JSAV.git JSAV
  (Note that this is a read-only URL. If you are joining the developer
   team, and you are not sufficiently familiar with Git to know what
   to do to set things up right to be able to push changes, talk to us
   about it.)
* Go to the JSAV folder or directory that you just created and run:
    make
  This will "compile" the pieces together for you. At this point, you
  are ready to try out the examples or invoke your copy of JSAV in
  your own development projects.

For SVN users new to git:
* To "checkout" a new copy of the library, use "git clone".
* To "update" your copy of the repository, use "git pull".
