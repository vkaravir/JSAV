---
layout: subpage
title: Downloading and Installing JSAV
---

###Before you Begin (Install Dependencies)

In order to get JSAV downloaded and built, you need some software. Here's a list of the requirements, see
the linked sites for installation instructions.

 * [Git](http://git-scm.com/) is needed for checking the JSAV source code. We suggest you install Git, but you can get
    the code without Git (see below).
 * [Node.js](http://nodejs.org/) is needed in order to build JSAV.
 * [Make](https://www.gnu.org/software/make/) and/or [Grunt](http://gruntjs.com/) is used for building the JSAV library from the multiple source files. You can choose whichever tool you like better or find easier to install.
 * **uglify-js** is needed if you use ```make```. You can install it with ```npm install -g uglify-js```.

###Getting the code from Github

Once you have ```git``` installed, getting JSAV source code is simple as going to command line, change directory to
where you want the JSAV code to be downloaded (git will make a subdirectory called ```JSAV```), and cloning the
JSAV repository by typing the command

    git clone https://github.com/vkaravir/JSAV.git

Now you have the JSAV code in the ```JSAV``` directory.

If you don't have ```git``` installed, you can [download a ZIP file](https://github.com/vkaravir/JSAV/archive/master.zip)
of the code and unzip it. Note, that this approach will make updating JSAV more difficult.

###Building JSAV

Building JSAV is relatively simple as well.

#### Building with Make

Move to the ```JSAV``` directory you cloned (or unzipped), and type

    make

That should build JSAV into the ```build/``` directory. There should be two files in that directory: ```JSAV.js``` and
the minified version ```JSAV-min.js```. If you don't have uglify-js installed, ```make``` will throw an error and you won't
have the minified version. You can still use the non-minified version, though.

#### Building with Grunt

First, make sure you have Grunt installed. The first time you build you need to install the npm dependencies. It's as easy as typing

    npm install

in the ```JSAV``` directory. Once you have installed the dependencies, you can build JSAV with simply typing

    grunt

That should build JSAV into the ```build/``` directory. There should be two files in that directory: ```JSAV.js``` and
the minified version ```JSAV-min.js```.

The [next section](../html) will tell you what to do with those files.