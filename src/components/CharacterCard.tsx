import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Character } from '../types';

interface CharacterCardProps {
    character: Character;
    onPress: (character: Character) => void;
}


export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onPress }) => {
    const [expanded, setExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleExpanded = () => {
        const toValue = expanded ? 0 : 1;

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setExpanded(!expanded);
    };

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

    const animatedHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 140],
    });

    const animatedOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => onPress(character)}
                activeOpacity={0.8}
            >
                <View style={styles.mainContent}>
                    <Image
                        source={{ uri: character.image }}
                        style={styles.image}
                        contentFit="cover"
                        placeholder={{ uri: 'https://via.placeholder.com/150x150' }}
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.name} numberOfLines={1}>
                            {character.name}
                        </Text>
                        <View style={styles.statusContainer}>
                            <View
                                style={[
                                    styles.statusDot,
                                    { backgroundColor: getStatusColor(character.status) },
                                ]}
                            />
                            <Text style={styles.status}>{character.status}</Text>
                        </View>
                        <Text style={styles.species}>{character.species}</Text>
                        <Text style={styles.location} numberOfLines={1}>
                            📍 {character.location.name}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.expandButton}
                onPress={toggleExpanded}
                activeOpacity={0.7}
            >
                <Text style={styles.expandButtonText}>
                    {expanded ? '▼' : '▶︎'} Quick View
                </Text>
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.expandedContent,
                    {
                        height: animatedHeight,
                        opacity: animatedOpacity,
                    },
                ]}
            >
                <View style={styles.expandedInfo}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Gender:</Text>
                        <Text style={styles.detailValue}>
                            {getGenderIcon(character.gender)} {character.gender}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Type:</Text>
                        <Text style={styles.detailValue}>
                            {character.type || 'Unknown'}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Origin:</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>
                            🌍 {character.origin.name}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Episodes:</Text>
                        <Text style={styles.detailValue}>
                            📺 {character.episode.length} episodes
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    card: {
        padding: 16,
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    status: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    species: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    location: {
        fontSize: 12,
        color: '#999',
    },
    expandButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center',
    },
    expandButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    expandedContent: {
        overflow: 'hidden',
        minHeight: 160,
    },
    expandedInfo: {
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        color: '#666',
        flex: 2,
        textAlign: 'right',
    },
});
