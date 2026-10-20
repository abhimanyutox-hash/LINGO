export interface LavaQuestion {
  id: number;
  englishPrompt: string;
  primaryFrench: string;
  acceptedTranslations: string[];
  hint: string;
}

/**
 * Hardcoded bank of 25 progressive English -> French vocabulary & short-phrase questions
 * for "The Floor is Lava" survival mode.
 */
export const LAVA_QUESTIONS_BANK: LavaQuestion[] = [
  {
    id: 1,
    englishPrompt: 'Hello',
    primaryFrench: 'Bonjour',
    acceptedTranslations: ['bonjour', 'salut'],
    hint: 'Starts with B...',
  },
  {
    id: 2,
    englishPrompt: 'Thank you',
    primaryFrench: 'Merci',
    acceptedTranslations: ['merci', 'merci beaucoup'],
    hint: '5 letters: M-e-r-c-i',
  },
  {
    id: 3,
    englishPrompt: 'The cat',
    primaryFrench: 'Le chat',
    acceptedTranslations: ['le chat', 'chat'],
    hint: 'Le c...',
  },
  {
    id: 4,
    englishPrompt: 'The dog',
    primaryFrench: 'Le chien',
    acceptedTranslations: ['le chien', 'chien'],
    hint: 'Le ch...',
  },
  {
    id: 5,
    englishPrompt: 'Yes, please',
    primaryFrench: "Oui, s'il vous plaît",
    acceptedTranslations: [
      'oui sil vous plait',
      'oui s il vous plait',
      'oui svp',
      'oui',
    ],
    hint: 'Oui, s’il vous plaît',
  },
  {
    id: 6,
    englishPrompt: 'A coffee',
    primaryFrench: 'Un café',
    acceptedTranslations: ['un cafe', 'cafe'],
    hint: 'Un c...',
  },
  {
    id: 7,
    englishPrompt: 'Water',
    primaryFrench: "L'eau",
    acceptedTranslations: ['leau', 'l eau', 'eau', 'de leau'],
    hint: 'E-a-u',
  },
  {
    id: 8,
    englishPrompt: 'Good evening',
    primaryFrench: 'Bonsoir',
    acceptedTranslations: ['bonsoir'],
    hint: 'Bon + soir',
  },
  {
    id: 9,
    englishPrompt: 'Goodbye',
    primaryFrench: 'Au revoir',
    acceptedTranslations: ['au revoir', 'salut', 'a bientot'],
    hint: 'Au r...',
  },
  {
    id: 10,
    englishPrompt: 'The bread',
    primaryFrench: 'Le pain',
    acceptedTranslations: ['le pain', 'pain'],
    hint: 'Le p...',
  },
  {
    id: 11,
    englishPrompt: 'I speak French',
    primaryFrench: 'Je parle français',
    acceptedTranslations: ['je parle francais', 'je parle le francais'],
    hint: 'Je parle ...',
  },
  {
    id: 12,
    englishPrompt: 'The house',
    primaryFrench: 'La maison',
    acceptedTranslations: ['la maison', 'maison'],
    hint: 'La m...',
  },
  {
    id: 13,
    englishPrompt: 'Red wine',
    primaryFrench: 'Le vin rouge',
    acceptedTranslations: ['le vin rouge', 'vin rouge', 'du vin rouge'],
    hint: 'Vin + rouge',
  },
  {
    id: 14,
    englishPrompt: 'The train station',
    primaryFrench: 'La gare',
    acceptedTranslations: ['la gare', 'gare'],
    hint: 'La g...',
  },
  {
    id: 15,
    englishPrompt: 'How much is it?',
    primaryFrench: "C'est combien ?",
    acceptedTranslations: ['cest combien', 'c est combien', 'combien'],
    hint: 'C’est combien',
  },
  {
    id: 16,
    englishPrompt: 'The check, please',
    primaryFrench: "L'addition",
    acceptedTranslations: [
      'laddition',
      'l addition',
      'laddition sil vous plait',
      'addition',
    ],
    hint: 'L’addition',
  },
  {
    id: 17,
    englishPrompt: 'I am hungry',
    primaryFrench: "J'ai faim",
    acceptedTranslations: ['jai faim', 'j ai faim'],
    hint: 'J’ai faim',
  },
  {
    id: 18,
    englishPrompt: 'The book',
    primaryFrench: 'Le livre',
    acceptedTranslations: ['le livre', 'livre'],
    hint: 'Le l...',
  },
  {
    id: 19,
    englishPrompt: 'The cat drinks milk',
    primaryFrench: 'Le chat boit du lait',
    acceptedTranslations: ['le chat boit du lait', 'le chat boit le lait'],
    hint: 'Le chat boit du lait',
  },
  {
    id: 20,
    englishPrompt: 'Excuse me',
    primaryFrench: 'Excusez-moi',
    acceptedTranslations: ['excusez moi', 'pardon'],
    hint: 'Excusez-moi',
  },
  {
    id: 21,
    englishPrompt: 'Where is the hotel?',
    primaryFrench: "Où est l'hôtel ?",
    acceptedTranslations: ['ou est lhotel', 'ou est l hotel'],
    hint: 'Où est l’hôtel',
  },
  {
    id: 22,
    englishPrompt: 'Two tickets',
    primaryFrench: 'Deux billets',
    acceptedTranslations: ['deux billets', '2 billets'],
    hint: 'Deux billets',
  },
  {
    id: 23,
    englishPrompt: 'See you tomorrow',
    primaryFrench: 'À demain',
    acceptedTranslations: ['a demain', 'demain'],
    hint: 'À demain',
  },
  {
    id: 24,
    englishPrompt: 'Very good',
    primaryFrench: 'Très bien',
    acceptedTranslations: ['tres bien', 'super'],
    hint: 'Très bien',
  },
  {
    id: 25,
    englishPrompt: 'I love Paris',
    primaryFrench: "J'aime Paris",
    acceptedTranslations: ['jaime paris', 'j aime paris', 'jadore paris'],
    hint: 'J’aime Paris',
  },
];

export interface LavaFlutterFileSpec {
  path: string;
  title: string;
  description: string;
  code: string;
}

export const LAVA_FLUTTER_FILES: LavaFlutterFileSpec[] = [
  {
    path: 'models/lava_question.dart',
    title: 'models/lava_question.dart',
    description: 'Data model + hardcoded bank of 25 progressive French vocabulary/phrase questions',
    code: `class LavaQuestion {
  final int id;
  final String englishPrompt;
  final String primaryFrench;
  final List<String> acceptedTranslations;
  final String hint;

  const LavaQuestion({
    required this.id,
    required this.englishPrompt,
    required this.primaryFrench,
    required this.acceptedTranslations,
    required this.hint,
  });

  static String normalize(String input) {
    return input
        .toLowerCase()
        .replaceAll('é', 'e')
        .replaceAll('è', 'e')
        .replaceAll('ê', 'e')
        .replaceAll('à', 'a')
        .replaceAll('â', 'a')
        .replaceAll('ù', 'u')
        .replaceAll('û', 'u')
        .replaceAll('î', 'i')
        .replaceAll('ô', 'o')
        .replaceAll('ç', 'c')
        .replaceAll(RegExp(r"[.,!?;:'\\"’\\-]"), ' ')
        .replaceAll(RegExp(r'\\s+'), ' ')
        .trim();
  }

  bool matches(String typedInput) {
    final cleanTyped = normalize(typedInput);
    if (cleanTyped.isEmpty) return false;
    return acceptedTranslations.any((ans) => normalize(ans) == cleanTyped);
  }
}

const List<LavaQuestion> kLavaQuestionsBank = [
  LavaQuestion(id: 1, englishPrompt: 'Hello', primaryFrench: 'Bonjour', acceptedTranslations: ['bonjour', 'salut'], hint: 'Starts with B...'),
  LavaQuestion(id: 2, englishPrompt: 'Thank you', primaryFrench: 'Merci', acceptedTranslations: ['merci', 'merci beaucoup'], hint: '5 letters: M-e-r-c-i'),
  LavaQuestion(id: 3, englishPrompt: 'The cat', primaryFrench: 'Le chat', acceptedTranslations: ['le chat', 'chat'], hint: 'Le c...'),
  LavaQuestion(id: 4, englishPrompt: 'The dog', primaryFrench: 'Le chien', acceptedTranslations: ['le chien', 'chien'], hint: 'Le ch...'),
  LavaQuestion(id: 5, englishPrompt: 'Yes, please', primaryFrench: "Oui, s'il vous plaît", acceptedTranslations: ['oui sil vous plait', 'oui svp', 'oui'], hint: "Oui, s'il vous plaît"),
  LavaQuestion(id: 6, englishPrompt: 'A coffee', primaryFrench: 'Un café', acceptedTranslations: ['un cafe', 'cafe'], hint: 'Un c...'),
  LavaQuestion(id: 7, englishPrompt: 'Water', primaryFrench: "L'eau", acceptedTranslations: ['leau', 'eau', 'de leau'], hint: 'E-a-u'),
  LavaQuestion(id: 8, englishPrompt: 'Good evening', primaryFrench: 'Bonsoir', acceptedTranslations: ['bonsoir'], hint: 'Bon + soir'),
  LavaQuestion(id: 9, englishPrompt: 'Goodbye', primaryFrench: 'Au revoir', acceptedTranslations: ['au revoir', 'salut'], hint: 'Au r...'),
  LavaQuestion(id: 10, englishPrompt: 'The bread', primaryFrench: 'Le pain', acceptedTranslations: ['le pain', 'pain'], hint: 'Le p...'),
  LavaQuestion(id: 11, englishPrompt: 'I speak French', primaryFrench: 'Je parle français', acceptedTranslations: ['je parle francais'], hint: 'Je parle ...'),
  LavaQuestion(id: 12, englishPrompt: 'The house', primaryFrench: 'La maison', acceptedTranslations: ['la maison', 'maison'], hint: 'La m...'),
  LavaQuestion(id: 13, englishPrompt: 'Red wine', primaryFrench: 'Le vin rouge', acceptedTranslations: ['le vin rouge', 'vin rouge'], hint: 'Vin + rouge'),
  LavaQuestion(id: 14, englishPrompt: 'The train station', primaryFrench: 'La gare', acceptedTranslations: ['la gare', 'gare'], hint: 'La g...'),
  LavaQuestion(id: 15, englishPrompt: 'How much is it?', primaryFrench: "C'est combien ?", acceptedTranslations: ['cest combien', 'combien'], hint: "C'est combien"),
  LavaQuestion(id: 16, englishPrompt: 'The check, please', primaryFrench: "L'addition", acceptedTranslations: ['laddition', 'addition'], hint: "L'addition"),
  LavaQuestion(id: 17, englishPrompt: 'I am hungry', primaryFrench: "J'ai faim", acceptedTranslations: ['jai faim'], hint: "J'ai faim"),
  LavaQuestion(id: 18, englishPrompt: 'The book', primaryFrench: 'Le livre', acceptedTranslations: ['le livre', 'livre'], hint: 'Le l...'),
  LavaQuestion(id: 19, englishPrompt: 'The cat drinks milk', primaryFrench: 'Le chat boit du lait', acceptedTranslations: ['le chat boit du lait'], hint: 'Le chat boit du lait'),
  LavaQuestion(id: 20, englishPrompt: 'Excuse me', primaryFrench: 'Excusez-moi', acceptedTranslations: ['excusez moi', 'pardon'], hint: 'Excusez-moi'),
  LavaQuestion(id: 21, englishPrompt: 'Where is the hotel?', primaryFrench: "Où est l'hôtel ?", acceptedTranslations: ['ou est lhotel'], hint: "Où est l'hôtel"),
  LavaQuestion(id: 22, englishPrompt: 'Two tickets', primaryFrench: 'Deux billets', acceptedTranslations: ['deux billets'], hint: 'Deux billets'),
  LavaQuestion(id: 23, englishPrompt: 'See you tomorrow', primaryFrench: 'À demain', acceptedTranslations: ['a demain', 'demain'], hint: 'À demain'),
  LavaQuestion(id: 24, englishPrompt: 'Very good', primaryFrench: 'Très bien', acceptedTranslations: ['tres bien', 'super'], hint: 'Très bien'),
  LavaQuestion(id: 25, englishPrompt: 'I love Paris', primaryFrench: "J'aime Paris", acceptedTranslations: ['jaime paris'], hint: "J'aime Paris"),
];`,
  },
  {
    path: 'widgets/lava_wave_painter.dart',
    title: 'widgets/lava_wave_painter.dart',
    description: 'CustomPainter for the dual-sine-wave magma surface, glowing gradient, and heat particles',
    code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class LavaWavePainter extends CustomPainter {
  final double phase;
  final double surfaceY;

  LavaWavePainter({
    required this.phase,
    required this.surfaceY,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final clampedY = surfaceY.clamp(0.0, size.height);

    // 1. Rising Heat Ember Particles above the lava surface
    final emberPaint = Paint()..style = PaintingStyle.fill;
    for (int i = 0; i < 16; i++) {
      final seed = i * 43.7;
      final x = ((seed * 19.3 + phase * 24.0) % size.width);
      final drift = ((phase * 45.0 + seed * 11.0) % 140.0);
      final y = clampedY - drift;
      if (y > 0 && y < size.height) {
        final alpha = (1.0 - (drift / 140.0)).clamp(0.15, 0.85);
        emberPaint.color = (i.isEven ? const Color(0xFFFFC800) : const Color(0xFFFF4B4B))
            .withOpacity(alpha);
        canvas.drawCircle(Offset(x, y), (i % 3 + 2).toDouble(), emberPaint);
      }
    }

    // 2. Dual-Sine-Wave Magma Surface Path
    final lavaPath = Path();
    lavaPath.moveTo(0, size.height);
    lavaPath.lineTo(0, clampedY);

    for (double x = 0; x <= size.width; x += 6) {
      final wave1 = math.sin((x * 0.025) + phase * 3.2) * 7.0;
      final wave2 = math.cos((x * 0.048) - phase * 2.1) * 4.5;
      lavaPath.lineTo(x, clampedY + wave1 + wave2);
    }

    lavaPath.lineTo(size.width, size.height);
    lavaPath.close();

    // 3. Glowing Magma Gradient (#FFC800 -> #FF9600 -> #EA2B2B)
    final rect = Rect.fromLTWH(0, clampedY - 12, size.width, size.height - clampedY + 24);
    final magmaPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Color(0xFFFFC800),
          Color(0xFFFF9600),
          Color(0xFFEA2B2B),
        ],
        stops: [0.0, 0.28, 1.0],
      ).createShader(rect);

    canvas.drawPath(lavaPath, magmaPaint);

    // 4. Bright Yellow-Orange Crest Highlight Line
    final crestPath = Path();
    for (double x = 0; x <= size.width; x += 6) {
      final wave1 = math.sin((x * 0.025) + phase * 3.2) * 7.0;
      final wave2 = math.cos((x * 0.048) - phase * 2.1) * 4.5;
      if (x == 0) {
        crestPath.moveTo(x, clampedY + wave1 + wave2);
      } else {
        crestPath.lineTo(x, clampedY + wave1 + wave2);
      }
    }

    final crestPaint = Paint()
      ..color = const Color(0xFFFFC800)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0;
    canvas.drawPath(crestPath, crestPaint);
  }

  @override
  bool shouldRepaint(covariant LavaWavePainter oldDelegate) {
    return oldDelegate.phase != phase || oldDelegate.surfaceY != surfaceY;
  }
}`,
  },
  {
    path: 'widgets/tile_tower_widget.dart',
    title: 'widgets/tile_tower_widget.dart',
    description: '3D stacked isometric blocks (140x36), breathing/panicked player avatar, and floating combat text',
    code: `import 'package:flutter/material.dart';

class EarnedLavaTile {
  final String label;
  final Color bgColor;
  final Color borderColor;
  final Color textColor;
  final double heightMeters;

  const EarnedLavaTile({
    required this.label,
    required this.bgColor,
    required this.borderColor,
    required this.textColor,
    required this.heightMeters,
  });
}

class TileTowerWidget extends StatelessWidget {
  final List<EarnedLavaTile> tiles;
  final bool isPanicked;
  final String? floatingCombatText;
  final Animation<double> avatarBreathAnimation;

  const TileTowerWidget({
    super.key,
    required this.tiles,
    required this.isPanicked,
    required this.floatingCombatText,
    required this.avatarBreathAnimation,
  });

  @override
  Widget build(BuildContext context) {
    final visibleTiles = tiles.reversed.take(7).toList();

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (floatingCombatText != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFFFC800),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                floatingCombatText!,
                style: const TextStyle(
                  color: Color(0xFF131F24),
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                ),
              ),
            ),
          ),

        // Bouncy Mascot Avatar on top of the highest tile
        ScaleTransition(
          scale: avatarBreathAnimation,
          child: Container(
            width: 54,
            height: 54,
            margin: const EdgeInsets.only(bottom: 4),
            decoration: BoxDecoration(
              color: isPanicked ? const Color(0xFFFF4B4B) : const Color(0xFF58CC02),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white, width: 2.5),
              boxShadow: [
                BoxShadow(
                  color: isPanicked ? const Color(0xFFEA2B2B) : const Color(0xFF46A302),
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            alignment: Alignment.center,
            child: Text(
              isPanicked ? '😰' : '😎',
              style: const TextStyle(fontSize: 26),
            ),
          ),
        ),

        // 3D Tactile Tile Stack (width: 140, height: 36, 6px bottom border)
        ...visibleTiles.map(
          (tile) => Container(
            width: 140,
            height: 36,
            margin: const EdgeInsets.only(bottom: 3),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: tile.bgColor,
              borderRadius: BorderRadius.circular(10),
              border: Border(
                bottom: BorderSide(color: tile.borderColor, width: 6),
              ),
            ),
            child: Text(
              tile.label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: tile.textColor,
                fontWeight: FontWeight.w800,
                fontSize: 13,
              ),
            ),
          ),
        ),
      ],
    );
  }
}`,
  },
  {
    path: 'screens/lava_game_screen.dart',
    title: 'screens/lava_game_screen.dart',
    description: '60-FPS Ticker game loop, stopwatch speed bonus math, camera shake, HUD, and persistent keyboard dock',
    code: `import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import '../models/lava_question.dart';
import '../widgets/lava_wave_painter.dart';
import '../widgets/tile_tower_widget.dart';

class LavaGameScreen extends StatefulWidget {
  const LavaGameScreen({super.key});

  @override
  State<LavaGameScreen> createState() => _LavaGameScreenState();
}

class _LavaGameScreenState extends State<LavaGameScreen>
    with TickerProviderStateMixin {
  static const double kPixelsPerMeter = 18.0;

  late final Ticker _ticker;
  late final AnimationController _breathController;
  late final AnimationController _shakeController;
  final TextEditingController _textController = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  double playerAltitude = 15.0;
  double lavaAltitude = 0.0;
  double _wavePhase = 0.0;
  Duration _lastTick = Duration.zero;

  int score = 0;
  int streak = 0;
  int questionIndex = 0;
  int _questionStartMs = DateTime.now().millisecondsSinceEpoch;
  bool isGameOver = false;
  bool isWrongFlash = false;
  String? floatingCombatText;

  List<EarnedLavaTile> towerTiles = [
    const EarnedLavaTile(
      label: 'BASE 15m',
      bgColor: Color(0xFF58CC02),
      borderColor: Color(0xFF46A302),
      textColor: Colors.white,
      heightMeters: 15.0,
    ),
  ];

  double get lavaSpeed => 1.8 + (score ~/ 5) * 0.15;

  @override
  void initState() {
    super.initState();
    _breathController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
      lowerBound: 0.95,
      upperBound: 1.06,
    )..repeat(reverse: true);

    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );

    _ticker = createTicker(_onTick)..start();
  }

  void _onTick(Duration elapsed) {
    if (isGameOver) return;
    final dt = _lastTick == Duration.zero
        ? 0.016
        : (elapsed - _lastTick).inMicroseconds / 1000000.0;
    _lastTick = elapsed;

    setState(() {
      _wavePhase += dt;
      lavaAltitude += lavaSpeed * dt;

      if (lavaAltitude >= playerAltitude) {
        lavaAltitude = playerAltitude;
        isGameOver = true;
        _ticker.stop();
        HapticFeedback.heavyImpact();
      }
    });
  }

  void _submitTranslation() {
    if (isGameOver) return;
    final currentQ = kLavaQuestionsBank[questionIndex % kLavaQuestionsBank.length];
    final typed = _textController.text;

    if (currentQ.matches(typed)) {
      final nowMs = DateTime.now().millisecondsSinceEpoch;
      final timeTakenSeconds = (nowMs - _questionStartMs) / 1000.0;

      double gain = 4.5;
      Color tileBg = const Color(0xFF78909C);
      Color tileBorder = const Color(0xFF455A64);
      Color tileText = Colors.white;
      String popup = '😅 PHEW! +4.5m';

      if (timeTakenSeconds < 2.0) {
        gain = 12.0;
        tileBg = const Color(0xFF00E5FF);
        tileBorder = const Color(0xFF0099B8);
        tileText = const Color(0xFF0F172A);
        popup = '⚡ SPEED BONUS! +12m';
      } else if (timeTakenSeconds <= 4.5) {
        gain = 8.0;
        tileBg = const Color(0xFF58CC02);
        tileBorder = const Color(0xFF46A302);
        tileText = Colors.white;
        popup = '🔥 GREAT! +8m';
      }

      setState(() {
        score += 1;
        streak += 1;
        playerAltitude += gain;
        floatingCombatText = popup;
        towerTiles.add(
          EarnedLavaTile(
            label: currentQ.primaryFrench,
            bgColor: tileBg,
            borderColor: tileBorder,
            textColor: tileText,
            heightMeters: gain,
          ),
        );
        questionIndex += 1;
        _questionStartMs = DateTime.now().millisecondsSinceEpoch;
      });
      _textController.clear();
      _focusNode.requestFocus();
    } else {
      // Wrong Answer Penalty: camera shake + red flash + +2.5m lava surge
      HapticFeedback.mediumImpact();
      _shakeController.forward(from: 0.0);
      setState(() {
        streak = 0;
        isWrongFlash = true;
        lavaAltitude += 2.5;
      });
      _textController.clear();
      _focusNode.requestFocus();
      Future.delayed(const Duration(milliseconds: 350), () {
        if (mounted) setState(() => isWrongFlash = false);
      });
    }
  }

  @override
  void dispose() {
    _ticker.dispose();
    _breathController.dispose();
    _shakeController.dispose();
    _textController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentQ = kLavaQuestionsBank[questionIndex % kLavaQuestionsBank.length];
    final distanceMeters = (playerAltitude - lavaAltitude).clamp(0.0, 999.0);
    final isDanger = distanceMeters < 5.0;

    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: LayoutBuilder(
        builder: (context, constraints) {
          final visibleHeight = constraints.maxHeight;
          final playerAnchorY = visibleHeight * 0.45;
          final lavaSurfaceY = playerAnchorY + (distanceMeters * kPixelsPerMeter);

          return AnimatedBuilder(
            animation: _shakeController,
            builder: (context, child) {
              final shakeX = math.sin(_shakeController.value * math.pi * 4) * 10.0;
              return Transform.translate(
                offset: Offset(shakeX, 0),
                child: child,
              );
            },
            child: Stack(
              children: [
                // Layer 1: Dynamic Heat Background (#131F24 -> #381212)
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Color(0xFF131F24), Color(0xFF381212)],
                    ),
                  ),
                ),

                // Layer 2: Camera & 3D Tile Tower anchored at 45% height
                Positioned(
                  top: playerAnchorY - 64,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: TileTowerWidget(
                      tiles: towerTiles,
                      isPanicked: isDanger,
                      floatingCombatText: floatingCombatText,
                      avatarBreathAnimation: _breathController,
                    ),
                  ),
                ),

                // Layer 3: Rising Lava (CustomPainter)
                Positioned.fill(
                  child: IgnorePointer(
                    child: CustomPaint(
                      painter: LavaWavePainter(
                        phase: _wavePhase,
                        surfaceY: lavaSurfaceY,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}`,
  },
];
