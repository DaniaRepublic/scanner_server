###
# This script starts ticket management program,
# it also automatically opens web interface.
###

# start or restart (if running) (host: localhost, port: 5000)
x=`lsof -t -i:5000`

if [ -z "$x" ]
then
    /Users/ivan/Documents/go_files/scanner_server/web_interface.js &
else
    kill -9 $x
    sleep 0.2 # wait for process to die
    /Users/ivan/Documents/go_files/scanner_server/web_interface.js &
fi

# wait for node to start listening, then open web interface
sleep 0.4
open -a Firefox http://localhost:5000/