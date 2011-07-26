RM = rm -rf
LIB = lib
MINIMIZE = java -jar tools/yuicompressor-2.4.6.jar --nomunge --preserve-semi -o $(TARGET)/JSAV-min.js  $(TARGET)/JSAV.js 
CAT = cat
SRC = src
TARGET = build
SOURCES = $(SRC)/front.js $(SRC)/core.js $(SRC)/anim.js $(SRC)/messages.js $(SRC)/graphicals.js $(SRC)/datastructures.js $(SRC)/layout.js $(SRC)/version.js 

all: build

# This will grab all of the libraries that one needs to be able to develop
# This version is git-centric 
setup: library build minimize

clean:
	$(RM) *~
	$(RM) build/*
	$(RM) examples/*~
	$(RM) src/*~ src/version.txt src/front.js src/version.js
	$(RM) css/*~

library:
	git submodule init
	git submodule update
	git pull

build: $(TARGET)/JSAV.js minimize

$(TARGET)/JSAV.js: $(SRC)/version.txt $(SRC)/front.js $(SRC)/version.js $(SOURCES)
	-mkdir $(TARGET)
	$(CAT) $(SOURCES) > $(TARGET)/JSAV.js

$(SRC)/version.txt: .git/FETCH_HEAD
	git describe --tags --long | awk '{ printf "%s", $$0 }' - > $(SRC)/version.txt

$(SRC)/front.js: $(SRC)/front1.txt $(SRC)/version.txt $(SRC)/front2.txt
	$(CAT) $(SRC)/front1.txt $(SRC)/version.txt $(SRC)/front2.txt > $(SRC)/front.js

$(SRC)/version.js :$(SRC)/version1.txt $(SRC)/version.txt $(SRC)/version2.txt
	$(CAT) $(SRC)/version1.txt $(SRC)/version.txt $(SRC)/version2.txt > $(SRC)/version.js

minimize: $(TARGET)/JSAV-min.js

$(TARGET)/JSAV-min.js: $(SOURCES)
	$(MINIMIZE)
