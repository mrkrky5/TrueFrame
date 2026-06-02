import { StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";

function Block({ style }: { style?: object }) {
  return <View style={[styles.block, style]} />;
}

/** Full-screen boot placeholder while fonts load. */
export function AppBootSkeleton() {
  return (
    <View style={styles.boot}>
      <Block style={styles.bootTitle} />
      <Block style={styles.bootLine} />
      <Block style={styles.bootHero} />
      <Block style={styles.bootCard} />
    </View>
  );
}

export function HomeTabSkeleton() {
  return (
    <View style={styles.pad}>
      <Block style={styles.h6} />
      <Block style={styles.h24} />
      <Block style={styles.hero} />
      <Block style={styles.h10} />
      <Block style={styles.card} />
      <Block style={styles.card} />
    </View>
  );
}

export function ExploreTabSkeleton() {
  return (
    <View style={styles.pad}>
      <Block style={styles.h20} />
      <Block style={styles.h10} />
      <Block style={styles.search} />
      <Block style={styles.card} />
      <Block style={styles.card} />
      <Block style={styles.card} />
    </View>
  );
}

export function ListTabSkeleton() {
  return (
    <View style={styles.pad}>
      <Block style={styles.h20} />
      <Block style={styles.row} />
      <Block style={styles.row} />
      <Block style={styles.row} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: theme.border,
    borderRadius: 12,
    opacity: 0.55,
  },
  boot: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingTop: 64,
    gap: 12,
  },
  bootTitle: { height: 28, width: "55%", borderRadius: 8 },
  bootLine: { height: 14, width: "40%" },
  bootHero: { height: 160, width: "100%", borderRadius: 22, marginTop: 8 },
  bootCard: { height: 120, width: "100%", borderRadius: 20 },
  pad: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },
  h6: { height: 12, width: 80 },
  h10: { height: 10, width: 120 },
  h20: { height: 20, width: 140 },
  h24: { height: 24, width: "70%" },
  hero: { height: 148, width: "100%", borderRadius: 22 },
  card: { height: 112, width: "100%", borderRadius: 20 },
  search: { height: 44, width: "100%", borderRadius: 14 },
  row: { height: 88, width: "100%", borderRadius: 18 },
});
