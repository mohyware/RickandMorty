import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCharacterById } from '../store/slices/charactersSlice';

export const CharacterDetailsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { selectedCharacter, loading, error } = useSelector(
    (state: RootState) => state.characters
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCharacterById(parseInt(id, 10)));
    }
  }, [id, dispatch]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return '#4CAF50';
      case 'Dead':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'Male':
        return '♂';
      case 'Female':
        return '♀';
      case 'Genderless':
        return '⚪';
      default:
        return '❓';
    }
  };

  if (loading || !selectedCharacter) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading character details...</Text>
      </View>
    );
  }

  if (error || !selectedCharacter) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with image and basic info */}
        <View style={styles.header}>
          <Image
            source={{ uri: selectedCharacter.image }}
            style={styles.characterImage}
            contentFit="cover"
            placeholder={{ uri: 'https://via.placeholder.com/300x300' }}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.characterName}>{selectedCharacter.name}</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(selectedCharacter.status) },
                ]}
              />
              <Text style={styles.statusText}>{selectedCharacter.status}</Text>
            </View>
            <Text style={styles.species}>{selectedCharacter.species}</Text>
          </View>
        </View>

        {/* Detailed information */}
        <View style={styles.detailsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>
                {getGenderIcon(selectedCharacter.gender)} {selectedCharacter.gender}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>
                {selectedCharacter.type || 'Unknown'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Species</Text>
              <Text style={styles.detailValue}>{selectedCharacter.species}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current Location</Text>
              <Text style={styles.detailValue}>
                📍 {selectedCharacter.location.name}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Origin</Text>
              <Text style={styles.detailValue}>
                🌍 {selectedCharacter.origin.name}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Episode Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Episodes</Text>
              <Text style={styles.detailValue}>
                📺 {selectedCharacter.episode.length} episodes
              </Text>
            </View>
            <View style={styles.episodeList}>
              <Text style={styles.episodeListTitle}>Episode IDs:</Text>
              <Text style={styles.episodeIds}>
                {selectedCharacter.episode
                  .map(ep => ep.split('/').pop())
                  .join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedCharacter.created).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Character ID</Text>
              <Text style={styles.detailValue}>#{selectedCharacter.id}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  characterImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  headerInfo: {
    alignItems: 'center',
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  species: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  episodeList: {
    marginTop: 8,
  },
  episodeListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  episodeIds: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
