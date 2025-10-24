import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CharacterCard } from '../components/CharacterCard';
import { AppDispatch, RootState } from '../store';
import { fetchCharacters, resetCharacters } from '../store/slices/charactersSlice';
import { Character } from '../types';

export const CharacterListScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { data, loading, error, hasNextPage, currentPage } = useSelector(
        (state: RootState) => state.characters
    );

    const flashListRef = useRef<FlashListRef<Character>>(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        dispatch(fetchCharacters({ page: 1 }));
    }, [dispatch]);

    const handleEndReached = useCallback(() => {
        if (hasNextPage && !loading) {
            dispatch(fetchCharacters({ page: currentPage + 1 }));
        }
    }, [hasNextPage, loading, currentPage, dispatch]);

    const handleRefresh = useCallback(() => {
        dispatch(resetCharacters());
        dispatch(fetchCharacters({ page: 1 }));
    }, [dispatch]);

    const handleCharacterPress = useCallback((character: Character) => {
        router.push(`/character-details/${character.id}`);
    }, [router]);

    const handleScrollToTop = useCallback(() => {
        flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        setShowScrollToTop(currentOffset > 300);
    }, []);

    const renderCharacter = useCallback(({ item }: { item: Character }) => (
        <CharacterCard character={item} onPress={handleCharacterPress} />
    ), [handleCharacterPress]);

    const renderFooter = useCallback(() => {
        if (loading && data.length > 0) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading more characters...</Text>
                </View>
            );
        }
        return null;
    }, [loading, data.length]);

    const renderEmpty = useCallback(() => {
        if (loading && data.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.emptyText}>Loading characters...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (data.length === 0 && !loading) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No characters available</Text>
                </View>
            );
        }

        return null;
    }, [loading, data.length, error, handleRefresh]);

    const keyExtractor = useCallback((item: Character) => item.id.toString(), []);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Rick and Morty Characters</Text>
            </View>

            <FlashList
                ref={flashListRef}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderCharacter}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && data.length === 0}
                        onRefresh={handleRefresh}
                        tintColor="#007AFF"
                        title="Pull to refresh"
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            {showScrollToTop && (
                <TouchableOpacity
                    style={styles.scrollToTopButton}
                    onPress={handleScrollToTop}
                    activeOpacity={0.8}
                >
                    <Text style={styles.scrollToTopText}>↑</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
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
    scrollToTopButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollToTopText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});