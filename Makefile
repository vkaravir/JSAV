RM = rm -rf
LIB = libsandstuff
MINIMIZE = touch $(TARGET)/JSAV-min.js # java magic $(SOURCES) > $(TARGET)/JSAV-min.js
CAT = cat
SRC = src
TARGET = build
SOURCES = $(SRC)/init.txt $(SRC)/core.js $(SRC)/messages.js $(SRC)/graphicals.js $(SRC)/datastructures.js $(SRC)/layout.js


all: build

# This will grab all of the libraries that one needs to be able to develop
# This version is git-centric
setup: library build minimize
	-mkdir $(TARGET)

clean:
	$(RM) *~
	$(RM) build/*
	$(RM) examples/*~
	$(RM) src/*~

library:
	git submodule init
	git submodule

build: $(TARGET)/JSAV.js

$(TARGET)/JSAV.js: $(SOURCES)
	$(CAT) $(SOURCES) > $(TARGET)/JSAV.js

minimize: $(TARGET)/JSAV-min.js

$(TARGET)/JSAV-min.js: $(SOURCES)
	$(MINIMIZE)
