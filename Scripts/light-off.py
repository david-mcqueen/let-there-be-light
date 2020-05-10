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

for i in range(maxvalue - 1, 0, -1):
	subprocess.check_call(['pigs', 'p 17', str(i)])
	if i > midpoint:
		cwValue = (i - midpoint) * 2
		subprocess.check_call(['pigs', 'p 22', str(cwValue)])
		print(str(cwValue))
	else:
		subprocess.check_call(['pigs', 'p 22', str(0)])

	print(str(i))
	time.sleep(epochDelay)

subprocess.check_call(['pigs', 'p 17', str(0)])
elapsed_time = time.time() - start_time
print(str(elapsed_time))
print("done")
