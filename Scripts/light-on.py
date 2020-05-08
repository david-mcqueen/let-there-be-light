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

for i in range(maxvalue):
	subprocess.check_call(['pigs', 'p 17', str(i)])
	if i > midpoint:
		cwValue = (i - midpoint) * 2
		subprocess.check_call(['pigs', 'p 22', str(cwValue)])
		print(str(cwValue))

	print(str(i))
	time.sleep(epochDelay)

elapsed_time = time.time() - start_time
print(str(elapsed_time))
print("done")
