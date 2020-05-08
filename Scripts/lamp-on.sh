#!/bin/bash

echo starting
mins=4
secs=$((60 * $mins))

end=$((SECONDS + $secs))
echo -e $end
##midyway is 75% way through
midway=$((($secs / 4) * 3))

while [ $SECONDS -lt $end ]; do
	wwamount=$((( 255 / $secs) * SECONDS))
	echo -e $wwamount
	if (($wwamount > 255))
	then
	wwamount=255
	fi

	
	pigs p 17 $wwamount

	if ((SECONDS > $midway))
	then
	secondarySecs=$(($secs-$midway))

	cwamount=$(((255 / $secondarySecs) * (SECONDS - $midway)))
	if (($cwamount > 255))
	then
	cwamount=255
	fi

	#echo -e $cwamount

	#pigs p 22 $cwamount

	fi
done

##Make sure we are at full brightness
pigs p 17 255
#pigs p 22 255

echo done
