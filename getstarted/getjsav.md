---
layout: subpage
title: Downloading and Installing JSAV
---

###Before you Begin (Install Dependencies)

In order to get JSAV downloaded and built, you need some software. Here's a list of the requirements, see
the linked sites for installation instructions.

 * [Git](http://git-scm.com/) is needed for checking the JSAV source code. We suggest you install Git, but you can get
    the code without Git (see below).
 * [Java](http://www.java.com/) is needed for building the minified version of JSAV. Using the non-minified version is
    perfectly fine for development, so you don't necessarily need Java. If building JSAV for development, we strongly
    suggest you install Java.
 * [Make](https://www.gnu.org/software/make/) is used for building the JSAV library from the multiple source files.
    There is no simple way to build JSAV without installing Make.

###Getting the code from Github

Once you have ```git``` installed, getting JSAV source code is simple as going to command line, change directory to
where you want the JSAV code to be downloaded (git will make a subdirectory called ```JSAV```), and cloning the
JSAV repository by typing the command

    git clone https://github.com/vkaravir/JSAV.git

Now you have the JSAV code in the ```JSAV``` directory.

If you don't have ```git``` installed, you can [download a ZIP file](https://github.com/vkaravir/JSAV/archive/master.zip)
of the code and unzip it. Note, that this approach will make updating JSAV more difficult.

###Building JSAV

Building JSAV is relatively simple as well. Move to the ```JSAV``` directory you cloned (or unzipped), and type

    make

That should build JSAV into the ```build/``` directory. There should be two files in that directory: ```JSAV.js``` and
the minified version ```JSAV-min.js```. If you don't have Java installed, ```make``` will throw an error and you won't
have the minified version. You can still use the non-minified version, though.

The [next section](../html) will tell you what to do with those files.