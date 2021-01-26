#!/usr/bin/python3

import re
import os
import subprocess
import sys
import asyncio
import contextlib
import signal
import argparse
from collections import namedtuple 

@contextlib.contextmanager
def pushd(dir):
    prev_dir = os.getcwd()
    os.chdir(dir)
    try:
        yield
    finally:
        os.chdir(prev_dir)

def find_git_modules():
    path_reg = r"^\s*path\s*=\s*(?P<path>[\w\-]+)$"
    with open('.gitmodules', 'r') as fp:
        s = fp.read()
        return re.findall(path_reg, s, re.MULTILINE|re.ASCII)

async def npm_install(path):
    with pushd(path):
        print(f"Installing npm modules for {path}!")
        os.system("npm install")

def parse_args(argv):
    args = [ ('install', 'Install dependencies for services')
           , ('clone', 'Clone down submodules')
           , ('run', 'Run all services')
           ]
    parser = argparse.ArgumentParser(description="Helper script for the JTWENL proxy server")
    actions = parser.add_mutually_exclusive_group(required=True)
    for arg, help in args:
        actions.add_argument('--'+arg, f"-{arg[0]}", help=help, action='store_true')

    return parser.parse_args(argv)

async def clone_modules():
    await os.system("git submodule update --init --recursive --remote")

def run_services(paths):
    procs = []
    for p in paths:
        with pushd(p):
            try: 
                proc = subprocess.Popen(["npm", "start"])
                print(f"Service running in the background: {p}, new pid is {proc.pid}")
                procs.append(proc)
            except OSError as e:
                print(e)
                pretty_kill(procs)
                sys.exit(0)

    return procs

async def run_installs(paths):
    for p in paths:
        await npm_install(p)
    return

async def bg_loop():
    while True:
        # just a dummy loop to keep it from exiting
        await asyncio.sleep(300)

def pretty_kill(procs):
    print("") # create newline after ^C
    for i in procs:
        print(f"killed pid {i.pid}")
        i.terminate()
    return

def signal_handler(procs):
    def cleanup(signum, frame):
        pretty_kill(procs)
        sys.exit(0)
    return cleanup

async def main():
    args = parse_args(sys.argv[1:])
    if args.clone:
        clone_modules()    
        sys.exit(0)
    paths = find_git_modules()
    if args.install:
        await run_installs(paths)
        sys.exit(0)
    else:
        procs = run_services(paths)
        for sig in [signal.SIGINT, signal.SIGTERM]:
            signal.signal(sig, signal_handler(procs))
        await bg_loop()

if __name__ == '__main__':
    asyncio.run(main())