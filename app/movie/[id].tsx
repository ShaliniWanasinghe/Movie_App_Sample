import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { movies } from "../../assets/data/movies";

const { height } = Dimensions.get("window");

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const movie = movies.find((m) => m.id.toString() === id);

  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. Load saved rating
  useEffect(() => {
    if (!movie) return;

    const loadRating = async () => {
      try {
        const saved = await AsyncStorage.getItem(`rating-${movie.id}`);
        if (saved) setRating(Number(saved));
      } catch (e) {
        console.error("Error loading rating:", e);
      }
    };

    loadRating();
  }, [movie]);

  // 2. Load favorite status
  useEffect(() => {
    if (!movie) return;

    const checkFavorite = async () => {
      try {
        const stored = await AsyncStorage.getItem("favorites");
        const favIds: number[] = stored ? JSON.parse(stored) : [];
        setIsFavorite(favIds.includes(movie.id));
      } catch (e) {
        console.error("Error checking favorite status:", e);
      }
    };

    checkFavorite();
  }, [movie]);

  // 3. Save movie to Recently Viewed
  useEffect(() => {
    if (!movie) return;

    const addToRecentlyViewed = async () => {
      try {
        const stored = await AsyncStorage.getItem("recentlyViewed");
        let recent: number[] = stored ? JSON.parse(stored) : [];

        // Remove current movie if already exists
        recent = recent.filter((m) => m !== movie.id);

        // Add current movie at the front
        recent.unshift(movie.id);

        // Keep only last 10
        if (recent.length > 10) recent = recent.slice(0, 10);

        await AsyncStorage.setItem("recentlyViewed", JSON.stringify(recent));
      } catch (e) {
        console.error("Error saving recently viewed:", e);
      }
    };

    addToRecentlyViewed();
  }, [movie]);

  // Save rating
  const handleRating = async (value: number) => {
    if (!movie) return;
    setRating(value);
    try {
      await AsyncStorage.setItem(`rating-${movie.id}`, value.toString());
    } catch (e) {
      console.error("Error saving rating:", e);
    }
  };

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!movie) return;

    try {
      const stored = await AsyncStorage.getItem("favorites");
      let favIds: number[] = stored ? JSON.parse(stored) : [];

      if (favIds.includes(movie.id)) {
        favIds = favIds.filter((itemId) => itemId !== movie.id);
        setIsFavorite(false);
      } else {
        favIds.push(movie.id);
        setIsFavorite(true);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favIds));
    } catch (e) {
      console.error("Error toggling favorite:", e);
    }
  };

  // Safe early return after all hooks are declared
  if (!movie) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="film-outline" size={60} color="#64748b" style={{ marginBottom: 16 }} />
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>Movie not found</Text>
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => (router.canGoBack() ? router.back() : router.push("/"))}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header action buttons over poster */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => (router.canGoBack() ? router.back() : router.push("/"))}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={toggleFavorite}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#ef4444" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <Image source={movie.image} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{movie.name}</Text>
          <TouchableOpacity
            style={[
              styles.favoriteBadge,
              isFavorite && { backgroundColor: "#ef444420", borderColor: "#ef4444" },
            ]}
            onPress={toggleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isFavorite ? "#ef4444" : "#94a3b8"}
            />
            <Text
              style={[
                styles.favoriteBadgeText,
                { color: isFavorite ? "#ef4444" : "#94a3b8" },
              ]}
            >
              {isFavorite ? "Favorited" : "Favorite"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{movie.description}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cast</Text>
            <Text style={styles.value}>{movie.cast}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Genre</Text>
            <Text style={styles.value}>{movie.genre}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Release Date</Text>
            <Text style={styles.value}>{movie.releaseDate}</Text>
          </View>
        </View>

        {/* ⭐ Rating Section */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}>Rate this movie</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                activeOpacity={0.7}
                style={styles.starTouchable}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color="#fbbf24"
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingFeedback}>You rated this {rating} / 5 stars</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  headerBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  image: {
    width: "100%",
    height: height * 0.48,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  favoriteBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1e293b",
  },
  favoriteBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  ratingCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  ratingTitle: {
    color: "#fff",
    fontSize: 17,
    marginBottom: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starTouchable: {
    padding: 6,
  },
  ratingFeedback: {
    color: "#fbbf24",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "500",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 20,
  },
  backHomeBtn: {
    marginTop: 20,
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
