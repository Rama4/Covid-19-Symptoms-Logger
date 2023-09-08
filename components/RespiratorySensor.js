import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {pairwise, startWith, skip} from 'rxjs/operators';
import Button from './Button';

const MeasuringIntervalSeconds = 15;
const AccelerometerUpdateIntervalMS = 900;
const RespiratoryMeasurementThreshold = 0.15;
const NumReadingsSkip = 1000 / AccelerometerUpdateIntervalMS;

setUpdateIntervalForType(
  SensorTypes.accelerometer,
  AccelerometerUpdateIntervalMS,
);

export default function RespiratorySensor() {
  [x, setX] = useState(0);
  [y, setY] = useState(0);
  [z, setZ] = useState(0);
  [k, setK] = useState(0);
  [enableAccelerometer, setEnableAccelerometer] = useState(false);
  let readingValues = [];

  const calculateRespiratoryRate2 = useCallback(() => {
    console.log('calculateRespiratoryRate2');
    let respRate = 0;
    console.log('k=', k);
    respRate = k * 30;
    console.log('respRate=', respRate);
    respRate = respRate / MeasuringIntervalSeconds;
    console.log('respRate=', respRate);
  }, []);

  const _getSubscription = useCallback(() => {
    return accelerometer
      .pipe(
        startWith(undefined), // emitting first empty value to fill-in the buffer
        skip(NumReadingsSkip),
        pairwise(),
      )
      .subscribe({
        next: ([previous, current]) => {
          // console.log(current);
          // omit first value
          if (!previous) return;
          if (previous !== current) {
            // console.log('previous=', previous);
            // console.log('current=', current);
            const prev_x = previous.x;
            const prev_y = previous.y;
            const prev_z = previous.z;
            const curr_x = current.x;
            const curr_y = current.y;
            const curr_z = current.z;
            const prev_val = Math.sqrt(
              prev_x * prev_x + prev_y * prev_y + prev_z * prev_z,
            );
            const curr_val = Math.sqrt(
              curr_x * curr_x + curr_y * curr_y + curr_z * curr_z,
            );
            if (
              Math.abs(prev_val - curr_val) > RespiratoryMeasurementThreshold
            ) {
              setK(_k => _k + 1);
            }
          }
        },
        error: e => {
          console.error(e);
        },
      });
  }, []);

  const getSubscription = useCallback(() => {
    return accelerometer.pipe().subscribe({
      next: current => {
        console.log(current);
        readingValues.push(current);
        // setReadingValues(_readingValues => {
        //   let newReadingValues = [...readingValues];
        //   newReadingValues.push(current);
        //   return newReadingValues;
        // });
      },
      error: e => {
        console.error(e);
      },
    });
  }, []);

  useEffect(() => {
    let subscription = null;
    if (enableAccelerometer) {
      subscription = _getSubscription();
    } else {
      calculateRespiratoryRate2();
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [enableAccelerometer]);

  useEffect(() => {
    console.log('k=', k);
  }, [k]);

  const onStartMeasureRespiratoryRatePress = useCallback(async () => {
    console.log('started measuring..');
    setK(0);
    readingValues = [];
    setEnableAccelerometer(true);
    setTimeout(() => {
      setEnableAccelerometer(false);
      console.log('stopped measuring..');
    }, MeasuringIntervalSeconds * 1000);
  }, [MeasuringIntervalSeconds]);

  return (
    <View style={styles.container}>
      {!enableAccelerometer ? (
        <Button
          title="Start measuring Respiratory rate"
          onPress={onStartMeasureRespiratoryRatePress}
        />
      ) : (
        <Text style={styles.headline}>
          Please lay down and place the smartphone on your chest for a period of
          45 seconds
        </Text>
      )}
      <Text>Number of Breaths taken: {k}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
});
