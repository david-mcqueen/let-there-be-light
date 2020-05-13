import subprocess
import time

print("starting")
start_time = time.time()
mins = 30
sec = 60 * mins
maxvalue = 255
midpoint = maxvalue / 2
epochDelay = sec / maxvalue

print(epochDelay)

subprocess.check_call(['pigs', 'p 22', str(0)])

for i in range(maxvalue / 2, 0, -1):
    	subprocess.check_call(['pigs', 'p 17', str(i)])
	
	print(str(i))
	time.sleep(epochDelay * 2)

subprocess.check_call(['pigs', 'p 17', str(0)])
elapsed_time = time.time() - start_time
print(str(elapsed_time))
print("done")