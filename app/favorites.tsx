import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { movies } from "../assets/data/movies";

export default function Favorites() {
  const router = useRouter();
  const [favoriteMovies, setFavoriteMovies] = useState<typeof movies>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites whenever the screen gains focus
  const loadFavorites = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      const favIds: number[] = stored ? JSON.parse(stored) : [];
      const favs = favIds
        .map((id) => movies.find((m) => m.id === id))
        .filter(Boolean) as typeof movies;
      setFavoriteMovies(favs);
    } catch (e) {
      console.error("Error loading favorites:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  // Remove a movie from favorites
  const removeFavorite = async (movieId: number) => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      let favIds: number[] = stored ? JSON.parse(stored) : [];
      favIds = favIds.filter((id) => id !== movieId);
      await AsyncStorage.setItem("favorites", JSON.stringify(favIds));
      setFavoriteMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch (e) {
      console.error("Error removing favorite:", e);
    }
  };

  const renderFavoriteItem = ({ item }: { item: (typeof movies)[0] }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={() => router.push(`/movie/${item.id}`)}
        activeOpacity={0.8}
      >
        <Image source={item.image} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.movieGenre} numberOfLines={1}>
            {item.genre}
          </Text>
          <Text style={styles.movieDate}>{item.releaseDate}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteMovies.length === 1
            ? "1 movie saved"
            : `${favoriteMovies.length} movies saved`}
        </Text>
      </View>

      {!isLoading && favoriteMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={64} color="#ef4444" />
          </View>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Browse the movie collection and tap the heart icon on any movie to save it to your favorites.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/")}
            activeOpacity={0.8}
          >
            <Ionicons name="compass-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.exploreButtonText}>Explore Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    overflow: "hidden",
  },
  cardTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 100,
    resizeMode: "cover",
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  movieTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 13,
    color: "#38bdf8",
    marginBottom: 4,
  },
  movieDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  removeButton: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
