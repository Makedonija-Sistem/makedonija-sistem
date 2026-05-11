# 📝 Препорачани Commit Messages

> Користи ги овие за конзистентност во репозиториумот.

## 🎉 Прв commit (за оvа upload)

```
🎉 Initial public MVP 0.1.0

Граѓанска платформа за модерна Македонија.

Содржина:
• 13 индустриски шампиони (€15.8B / 81,500 места)
• 11 институции (вкл. ФЕЗ/ДТИРЗ, НБРМ, МИПС, КИБС, КАСИС)
• 79 медиума и подкасти (10 ТВ, 8 радио, 37 портали, 5 печат, 4 агенции, 12 подкасти, 3 дијаспора)
• 80+1 општини на РСМ
• 5 јазици i18n (мк/en/al/sr/de)
• 3 рудни потенцијали (Алшар, Иловица-Штука, Казандол)

Безбедност:
• 0 чувствителни UI елементи (ЕМБГ, ЛК, документи)
• 0 external scripts (без Google Analytics, Plausible, Firebase)
• 0 YOUR_API_KEY placeholder-и
• 0 fake backend claims
• Минимален CSP (236 chars · само Google Fonts)
• PWA-ready + Service Worker за offline

Технички:
• Single-file HTML (1.8 MB · 12 valid scripts)
• Static deploy compatible (GitHub Pages, Netlify, Vercel)
• Без backend во оваа фаза
• Browser fingerprint protection во анкетата (1 глас по уред)
```

## 🔧 За идни промени

### Содржина
```
✨ Add new feature: [опис]

🐛 Fix typo in [секциja]

📝 Update [документ.md]

🌐 Translation: [јазик] - [секциja]
```

### Технички
```
♻️ Refactor [компонента]

⚡ Performance: [подобрување]

🔒 Security: [фикс]

🎨 UI: [промена]
```

### Документација
```
📚 Docs: update [документ]

📖 Add: [нов документ]
```

### Bug fix
```
🐛 Fix: [опис]

Closes #[issue-број] (ако постои)
```

## Конвенциja

Користи **Conventional Commits** + **gitmoji**:

```
<emoji> <type>: <опис>

[опционо: extended description]

[опционо: Closes #issue]
```

Главни типови:
- 🎉 `init` — прв commit
- ✨ `feat` — нова функционалност
- 🐛 `fix` — поправка на грешка
- 📝 `docs` — промени во документацијa
- 🎨 `style` — само формат (без логика)
- ♻️ `refactor` — refactoring (без feature)
- ⚡ `perf` — performance подобрување
- ✅ `test` — додавање тестови
- 🔒 `security` — безбедносна корекција
- 🌐 `i18n` — преводи

---

🇲🇰 *Конзистентност во commits = читливост во историјата = подобар проект.*
