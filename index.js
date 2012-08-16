#! /usr/bin/env node

var charm = require('charm')(process.stdout)
var keypress = require('keypress')(process.stdin)
var opts = require('optimist').argv
var fs = require('fs')

var file = opts._[0]
var text = require('fs').readFileSync(file, 'utf-8')
var slides = require('./sections')(text)

var mleft = 10
var mtop  = 5

function show () {
  if(index < 0) index = 0
  if(index >= slides.length) index = slides.length - 1

  var s = stats(slides[index])

  charm
    .reset()
    .position(1, mtop)
    .write(indent(slides[index], mleft))
    .position(mleft, process.stdout.rows - 3)
}
var index = 0
show(index)

process.stdin.setRawMode(true)
process.stdin.resume()

process.stdin.on('keypress', function (ch, key) {

  if(key.ctrl && /c|q/.test(key.name))
    charm.reset(), process.exit(0)
  else if(key.name == 'left')
    show(--index)
  else if(key.name == 'right')
    show(index ++)
  else if(key.name == 'home')
    show(index = 0)
  else if(key.name == 'end')
    show(index = slides.length - 1)
})

function stats (slide) {
  var lines = slide.split('\n')
  var max = 0
  lines.forEach(function (line) {
    if(line.length > max)
      max = line.length
  })
  return {
    height: lines.length,
    width:  max
  }
}

function indent(slide, indent) {
  var space = ''
  while (indent--)
    space += ' '
  return slide.split('\n').map(function (l) {
    return space + l
  }).join('\n')
}
