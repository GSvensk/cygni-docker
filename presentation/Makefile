.PHONY: all build clean init

INLINER=node_modules/.bin/inliner --nocompress --inlinemin
CSS=assets/css/*.css
SOURCES=$(wildcard *.html)
TARGETS=$(patsubst %.html, dist/%.html, $(SOURCES))

all: build 

build: ${TARGETS}

dist/%.html: %.html ${CSS} 
	mkdir -p dist && node ${INLINER} $< > $@ 

clean:
	rm -rf dist 

echo:
	echo ${TARGETS} 
