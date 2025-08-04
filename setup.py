import os
from datetime import datetime

outoutJSON = ""
FILE_LIST = []
FILE_METADATA = {}
STACK = []
def read_dirs(dir):
    STACK.append(dir)
    for i in os.listdir("/".join(STACK)):
        if i.endswith(".html"):
            STACK.append(i)
            FILE_LIST.append("/".join(STACK))
            STACK.pop()
        else :
            read_dirs(i)
    STACK.pop()


if __name__ == "__main__":
    read_dirs("./posts")
    for i in FILE_LIST:
        print(i, os.path.getsize(i), datetime.fromtimestamp(os.path.getmtime(i)))