import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, LogBox } from 'react-native';

LogBox.ignoreAllLogs();
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import NightPhaseScreen from './src/screens/NightPhaseScreen';
import DayPhaseScreen from './src/screens/DayPhaseScreen';
import VotingPhaseScreen from './src/screens/VotingPhaseScreen';
import RoleRevealScreen from './src/screens/RoleRevealScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import RoleCatalogScreen from './src/screens/RoleCatalogScreen';
import WerewolfTurnScreen from './src/screens/WerewolfTurnScreen';
import TimelineReplayScreen from './src/screens/TimelineReplayScreen';
import RoleDetailScreen from './src/screens/RoleDetailScreen';
import BloodMoonModifiersScreen from './src/screens/BloodMoonModifiersScreen';
import SleepMutePhaseScreen from './src/screens/SleepMutePhaseScreen';
import WakeUpSequenceScreen from './src/screens/WakeUpSequenceScreen';
import MasterUserFlowMapScreen from './src/screens/MasterUserFlowMapScreen';
import DayPhaseTransitionScreen from './src/screens/DayPhaseTransitionScreen';
import PhaseTransitionLoadingScreen from './src/screens/PhaseTransitionLoadingScreen';
import PrivateVoiceWakeUpScreen from './src/screens/PrivateVoiceWakeUpScreen';
import VoteResolutionScreen from './src/screens/VoteResolutionScreen';
import PrivateSeerResultScreen from './src/screens/PrivateSeerResultScreen';
import FinalRoleRevealScreen from './src/screens/FinalRoleRevealScreen';
import NightQueueSchedulerScreen from './src/screens/NightQueueSchedulerScreen';
import GameHallScreen from './src/screens/GameHallScreen';
import AudioConfigScreen from './src/screens/AudioConfigScreen';
import GameSelectionScreen from './src/screens/GameSelectionScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Splash');

  const navigate = (screenName) => {
    if (screenName === 'Splash') setCurrentScreen('Splash');
    else if (screenName === 'Home') setCurrentScreen('Home');
    else if (screenName === 'Lobby') setCurrentScreen('Lobby');
    else if (screenName === 'RoleReveal') setCurrentScreen('RoleReveal');
    else if (screenName === 'NightPhase') setCurrentScreen('NightPhase');
    else if (screenName === 'DayPhase') setCurrentScreen('DayPhase');
    else if (screenName === 'VotingPhase') setCurrentScreen('VotingPhase');
    else if (screenName === 'GameOver') setCurrentScreen('GameOver');
    else if (screenName === 'RoleCatalog') setCurrentScreen('RoleCatalog');
    else if (screenName === 'WerewolfTurn') setCurrentScreen('WerewolfTurn');
    else if (screenName === 'TimelineReplay') setCurrentScreen('TimelineReplay');
    else if (screenName === 'RoleDetail') setCurrentScreen('RoleDetail');
    else if (screenName === 'BloodMoonModifiers') setCurrentScreen('BloodMoonModifiers');
    else if (screenName === 'SleepMute') setCurrentScreen('SleepMute');
    else if (screenName === 'WakeUpSequence') setCurrentScreen('WakeUpSequence');
    else if (screenName === 'MasterUserFlowMap') setCurrentScreen('MasterUserFlowMap');
    else if (screenName === 'DayPhaseTransition') setCurrentScreen('DayPhaseTransition');
    else if (screenName === 'PhaseTransitionLoading') setCurrentScreen('PhaseTransitionLoading');
    else if (screenName === 'PrivateVoiceWakeUp') setCurrentScreen('PrivateVoiceWakeUp');
    else if (screenName === 'VoteResolution') setCurrentScreen('VoteResolution');
    else if (screenName === 'PrivateSeerResult') setCurrentScreen('PrivateSeerResult');
    else if (screenName === 'FinalRoleReveal') setCurrentScreen('FinalRoleReveal');
    else if (screenName === 'NightQueueScheduler') setCurrentScreen('NightQueueScheduler');
    else if (screenName === 'GameHall') setCurrentScreen('GameHall');
    else if (screenName === 'AudioConfig') setCurrentScreen('AudioConfig');
    else if (screenName === 'GameSelection') setCurrentScreen('GameSelection');
    else setCurrentScreen('Home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen navigation={{ replace: (screen) => navigate(screen) }} />;
      case 'Home':
        return <HomeScreen onNavigate={navigate} />;
      case 'Lobby':
        return <LobbyScreen onNavigate={navigate} />;
      case 'RoleReveal':
        return <RoleRevealScreen onNavigate={navigate} />;
      case 'NightPhase':
        return <NightPhaseScreen onNavigate={navigate} />;
      case 'DayPhase':
        return <DayPhaseScreen onNavigate={navigate} />;
      case 'VotingPhase':
        return <VotingPhaseScreen onNavigate={navigate} />;
      case 'GameOver':
        return <GameOverScreen onNavigate={navigate} />;
      case 'RoleCatalog':
        return <RoleCatalogScreen onNavigate={navigate} />;
      case 'WerewolfTurn':
        return <WerewolfTurnScreen onNavigate={navigate} />;
      case 'TimelineReplay':
        return <TimelineReplayScreen onNavigate={navigate} />;
      case 'RoleDetail':
        return <RoleDetailScreen onNavigate={navigate} />;
      case 'BloodMoonModifiers':
        return <BloodMoonModifiersScreen onNavigate={navigate} />;
      case 'SleepMute':
        return <SleepMutePhaseScreen onNavigate={navigate} />;
      case 'WakeUpSequence':
        return <WakeUpSequenceScreen onNavigate={navigate} />;
      case 'MasterUserFlowMap':
        return <MasterUserFlowMapScreen onNavigate={navigate} />;
      case 'DayPhaseTransition':
        return <DayPhaseTransitionScreen onNavigate={navigate} />;
      case 'PhaseTransitionLoading':
        return <PhaseTransitionLoadingScreen onNavigate={navigate} />;
      case 'PrivateVoiceWakeUp':
        return <PrivateVoiceWakeUpScreen onNavigate={navigate} />;
      case 'VoteResolution':
        return <VoteResolutionScreen onNavigate={navigate} />;
      case 'PrivateSeerResult':
        return <PrivateSeerResultScreen onNavigate={navigate} />;
      case 'FinalRoleReveal':
        return <FinalRoleRevealScreen onNavigate={navigate} />;
      case 'NightQueueScheduler':
        return <NightQueueSchedulerScreen onNavigate={navigate} />;
      case 'GameHall':
        return <GameHallScreen onNavigate={navigate} />;
      case 'AudioConfig':
        return <AudioConfigScreen onNavigate={navigate} />;
      case 'GameSelection':
        return <GameSelectionScreen onNavigate={navigate} />;
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111317" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111317',
  },
});
