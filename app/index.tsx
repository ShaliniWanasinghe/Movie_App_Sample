import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { movies } from "../assets/data/movies";
import { translations } from "./translations";

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [search, setSearch] = useState("");
  const [recentMovies, setRecentMovies] = useState<typeof movies>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [lang, setLang] = useState<"en" | "ta" | "si">("en");
  const [theme, setTheme] = useState<"light" | "dark">(
    colorScheme === "dark" ? "dark" : "light"
  );

  const t = translations[lang]; // current translation

  // Load recently viewed movies and favorites
  const loadData = useCallback(async () => {
    try {
      const storedRecent = await AsyncStorage.getItem("recentlyViewed");
      const recentIds: number[] = storedRecent ? JSON.parse(storedRecent) : [];
      const recent = recentIds
        .map((id) => movies.find((m) => m.id === id))
        .filter(Boolean) as typeof movies;
      setRecentMovies(recent);

      const storedFavs = await AsyncStorage.getItem("favorites");
      const favs: number[] = storedFavs ? JSON.parse(storedFavs) : [];
      setFavoriteIds(favs);
    } catch (e) {
      console.log("Error loading home data:", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Quick favorite toggle from home grid
  const toggleFavorite = async (movieId: number) => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      let favs: number[] = stored ? JSON.parse(stored) : [];
      if (favs.includes(movieId)) {
        favs = favs.filter((id) => id !== movieId);
      } else {
        favs.push(movieId);
      }
      setFavoriteIds(favs);
      await AsyncStorage.setItem("favorites", JSON.stringify(favs));
    } catch (e) {
      console.error("Error toggling favorite from home:", e);
    }
  };

  // Filter movies by search
  const filteredMovies = movies.filter(
    (movie) =>
      movie.name.toLowerCase().includes(search.toLowerCase()) ||
      movie.genre.toLowerCase().includes(search.toLowerCase())
  );

  const renderMovie = ({ item }: { item: (typeof movies)[0] }) => {
    const isFav = favoriteIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          theme === "dark" ? { backgroundColor: "#1e293b" } : { backgroundColor: "#f0f0f0" },
        ]}
        onPress={() => router.push(`/movie/${item.id}`)}
        activeOpacity={0.85}
      >
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.image} />
          <TouchableOpacity
            style={styles.cardHeartBtn}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>{isFav ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={1}
          style={[styles.movieName, theme === "dark" ? { color: "#fff" } : { color: "#000" }]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLang(lang === "en" ? "ta" : lang === "ta" ? "si" : "en");

  return (
    <ScrollView
      style={[
        styles.container,
        theme === "dark" ? { backgroundColor: "#0f172a" } : { backgroundColor: "#fff" },
      ]}
      contentContainerStyle={{ paddingBottom: 110 }}
    >
      {/* Language & Theme toggles */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <TouchableOpacity onPress={toggleLang}>
          <Text style={{ color: theme === "dark" ? "#fff" : "#000", fontWeight: "600" }}>
            Language: {lang.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={{ color: theme === "dark" ? "#fff" : "#000", fontWeight: "600" }}>
            {theme === "dark" ? t.themeDark : t.themeLight}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.header, theme === "dark" ? { color: "#fff" } : { color: "#000" }]}>
        {t.movieSuggestions}
      </Text>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          theme === "dark" ? { backgroundColor: "#1e293b" } : { backgroundColor: "#e0e0e0" },
        ]}
      >
        <TextInput
          placeholder={t.searchPlaceholder}
          placeholderTextColor={theme === "dark" ? "#94a3b8" : "#555"}
          style={[styles.searchInput, theme === "dark" ? { color: "#fff" } : { color: "#000" }]}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
        <TouchableOpacity onPress={() => setSearch("")}>
          <Text style={{ color: theme === "dark" ? "#fff" : "#000", marginLeft: 8 }}>✖</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: theme === "dark" ? "#fff" : "#000", marginBottom: 10 }}>
        {t.foundMovies.replace("{count}", filteredMovies.length.toString())}
      </Text>

      {/* Recently Viewed */}
      {recentMovies.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: theme === "dark" ? "#fff" : "#000",
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            {t.recentlyViewed}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentMovies.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/movie/${item.id}`)}
                style={{ marginRight: 15 }}
                activeOpacity={0.8}
              >
                <Image
                  source={item.image}
                  style={{ width: 120, height: 180, borderRadius: 10 }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    color: theme === "dark" ? "#fff" : "#000",
                    width: 120,
                    textAlign: "center",
                    marginTop: 5,
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Movies Grid */}
      <FlatList
        data={filteredMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text
            style={[
              styles.noResults,
              theme === "dark" ? { color: "#94a3b8" } : { color: "#555" },
            ]}
          >
            {t.noMovies}
          </Text>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  searchContainer: {
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
  },
  image: {
    width: "100%",
    height: 220,
  },
  cardHeartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  movieName: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    padding: 10,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
});
