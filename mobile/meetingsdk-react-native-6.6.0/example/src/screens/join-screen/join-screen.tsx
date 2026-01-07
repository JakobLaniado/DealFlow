import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { TextInputRow } from '../../components/text-input-row';
import {useZoom} from '@zoom/meetingsdk-react-native';

type JoinScreenProps = {
  route: any;
  navigation: any;
};

export function JoinScreen({ navigation }: JoinScreenProps) {
  const [meetingNumber, setMeetingNumber] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [zak, setZak] = useState('');
  const zoom = useZoom();

  useEffect(() => {
  }, []);

  const joinMeeting = async () => {
      if (!meetingNumber.trim()) {
          Alert.alert('Please Enter Valid Meeting Number');
          return;
      };
      if (!displayName.trim()) {
          Alert.alert('Please Enter Display Name');
          return;
      };
      if (!meetingPassword.trim()) {
          Alert.alert('Please Enter Password');
          return;
      };
      try {
        await zoom.joinMeeting({
          userName: displayName,
          meetingNumber: meetingNumber,
          password: meetingPassword,
          userType: 1,
        });
      } catch (e) {
        console.log(e);
        Alert.alert('Failed to join the meeting' + e);
        setTimeout(() => navigation.goBack(), 1000);
      }
  };

    const startMeeting = async () => {
        if (!displayName.trim()) {
            Alert.alert('Please Enter Display Name');
            return;
        };
        if (!zak.trim()) {
            Alert.alert('Please Enter ZAK Token');
            return;
        };
        try {
          await zoom.startMeeting({
            userName: displayName,
            meetingNumber: meetingNumber,
            zoomAccessToken: zak,
          });
        } catch (e) {
          console.log(e);
          Alert.alert('Failed to start the meeting' + e);
          setTimeout(() => navigation.goBack(), 1000);
        }
    };

  return (
    <View style={styles.container}>
      <TextInputRow
        label="Meeting Number"
        placeholder="Required"
        keyboardType="default"
        value={meetingNumber}
        onChangeText={setMeetingNumber}
      />
      <TextInputRow
        label="Display Name"
        placeholder="Required"
        keyboardType="default"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInputRow
        label="Password"
        placeholder="Optional"
        keyboardType="default"
        value={meetingPassword}
        onChangeText={setMeetingPassword}
        secureTextEntry
      />
      <TextInputRow
        label="ZAK Token"
        placeholder="Optional"
        keyboardType="default"
        value={zak}
        onChangeText={setZak}
      />
      <TouchableOpacity
        onPress={startMeeting}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{'Create a Meeting'}</Text>
      </TouchableOpacity>
        <TouchableOpacity
          onPress={joinMeeting}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{'Join a Meeting'}</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#0e71eb',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
