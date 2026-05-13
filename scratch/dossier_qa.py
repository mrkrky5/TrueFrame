import json
from collections import Counter

def analyze():
    with open('data/cards.json', 'r', encoding='utf-8') as f:
        cards = json.load(f)
    
    EXCLUDED_TITLES = [
        "Günlük Hayat",
        "Tarihi Yanılgı",
        "Popüler Kültür Yanılgıları",
        "Büyük Değişim",
        "Modern Tarih",
        "Atmosfer",
        "Unknown"
    ]

    dossiers = {}
    for card in cards:
        title = card.get('mediaTitle')
        if not title or title in EXCLUDED_TITLES:
            continue
        
        if title not in dossiers:
            dossiers[title] = {
                "count": 0,
                "flagships": 0,
                "reading_time": 0,
                "ids": []
            }
        
        dossiers[title]["count"] += 1
        dossiers[title]["ids"].append(card['id'])
        dossiers[title]["reading_time"] += card.get('readingTimeMinutes', 0)
        if card.get('isFlagship'):
            dossiers[title]["flagships"] += 1

    # Distribution
    dist = Counter([d["count"] for d in dossiers.values()])
    flagship_rich = [t for t, d in dossiers.items() if d["flagships"] > 0]
    
    # Sort for top lists
    top_by_count = sorted(dossiers.items(), key=lambda x: x[1]["count"], reverse=True)
    top_by_flagship = sorted(dossiers.items(), key=lambda x: (x[1]["flagships"], x[1]["count"]), reverse=True)

    report = {
        "total_dossiers": len(dossiers),
        "distribution": dict(dist),
        "flagship_rich_count": len(flagship_rich),
        "top_20_by_count": top_by_count[:20],
        "top_20_by_flagship": top_by_flagship[:20]
    }

    with open('scratch/dossier_qa_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    analyze()
