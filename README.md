[![Build Status](https://travis-ci.org/fiberwire/enviro.svg?branch=master)](https://travis-ci.org/fiberwire/enviro.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/fiberwire/enviro/badge.svg?branch=master)](https://coveralls.io/github/fiberwire/enviro?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Enviro
A reactive environment library.

## What is a reactive environment?
A reactive environment is a state container that can be updated asynchronously, at which point its updated state will be sent to all subscribers.

## What can I do with a reactive environment?
In the simplest case, using a `DirectEnvironment`, you could synchronize state between any number of sources of interaction in an asynchronous way with little effort.

In a more advanced case, you could use an `AgentEnvironment` to implement an authoritative game environment where Agents send input and the environment applies that input to its state. Or you could use it as an AI simulation environment.

I made this library to be used with [enome](http://www.github.com/fiberwire/enome), which is a reactive evolution framework.

### To-Do:
 - [x] `DirectEnvironment`
 - [x] `AgentEnvironment`
 - [ ] `TimeTravelEnvironment`
 - [ ] `TurnBasedEnvironment`