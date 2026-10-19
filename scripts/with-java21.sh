#!/bin/sh
# firebase-tools 15's emulators need Java 21+. Use Homebrew's openjdk@21 when it's installed
# (CI sets up its own Java), then run the given command.
J=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
if [ -d "$J" ]; then
  export JAVA_HOME="$J"
  export PATH="$J/bin:$PATH"
fi
exec "$@"
