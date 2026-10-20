export interface FlutterFileSpec {
  path: string;
  title: string;
  description: string;
  code: string;
}

export const FLUTTER_SOURCE_FILES: FlutterFileSpec[] = [
  {
    path: 'main.dart',
    title: 'main.dart',
    description: 'App entry point with GoogleFonts Nunito/Fredoka w900 typography and MainShellScreen',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/main_shell_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const LingoArenaApp());
}

class LingoArenaApp extends StatelessWidget {
  const LingoArenaApp({super.key});

  @override
  Widget build(BuildContext context) {
    final baseTheme = ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: const Color(0xFF145DA0),
    );

    return MaterialApp(
      title: 'LingoArena MVP',
      debugShowCheckedModeBanner: false,
      theme: baseTheme.copyWith(
        textTheme: GoogleFonts.nunitoTextTheme(baseTheme.textTheme).apply(
          bodyColor: Colors.white,
          displayColor: Colors.white,
        ),
      ),
      home: const MainShellScreen(),
    );
  }
}`,
  },
  {
    path: 'widgets/game_button.dart',
    title: 'widgets/game_button.dart',
    description: 'Reusable 3D tactile GestureDetector button with 6px bottom lip and 80ms 4px press shift',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

enum GameButtonStyle { gold, green, danger }

class GameButton extends StatefulWidget {
  final String label;
  final GameButtonStyle style;
  final VoidCallback? onTap;
  final double? width;
  final double height;
  final double fontSize;

  const GameButton({
    super.key,
    required this.label,
    this.style = GameButtonStyle.gold,
    this.onTap,
    this.width,
    this.height = 56.0,
    this.fontSize = 20.0,
  });

  @override
  State<GameButton> createState() => _GameButtonState();
}

class _GameButtonState extends State<GameButton> {
  bool _isPressed = false;

  Color get _faceColor {
    switch (widget.style) {
      case GameButtonStyle.gold:
        return const Color(0xFFFFA800);
      case GameButtonStyle.green:
        return const Color(0xFF58CC02);
      case GameButtonStyle.danger:
        return const Color(0xFFEA2B2B);
    }
  }

  Color get _bottomLipColor {
    switch (widget.style) {
      case GameButtonStyle.gold:
        return const Color(0xFFCC7A00);
      case GameButtonStyle.green:
        return const Color(0xFF46A302);
      case GameButtonStyle.danger:
        return const Color(0xFFB81D1D);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        if (widget.onTap == null) return;
        HapticFeedback.lightImpact();
        setState(() => _isPressed = true);
      },
      onTapUp: (_) {
        if (widget.onTap == null) return;
        setState(() => _isPressed = false);
        widget.onTap?.call();
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: SizedBox(
        width: widget.width ?? double.infinity,
        height: widget.height,
        child: Stack(
          children: [
            // 6px Darker Bottom Border Lip
            Positioned(
              left: 0,
              right: 0,
              top: 6.0,
              bottom: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: _bottomLipColor,
                  borderRadius: BorderRadius.circular(18),
                ),
              ),
            ),
            // Top Face Container (shifts down 4px over 80ms)
            AnimatedPositioned(
              duration: const Duration(milliseconds: 80),
              curve: Curves.easeOutQuad,
              left: 0,
              right: 0,
              top: _isPressed ? 4.0 : 0.0,
              bottom: _isPressed ? 2.0 : 6.0,
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: _faceColor,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.35),
                    width: 2.0,
                  ),
                ),
                child: Text(
                  widget.label,
                  style: GoogleFonts.nunito(
                    color: Colors.white,
                    fontSize: widget.fontSize,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                    shadows: const [
                      Shadow(
                        offset: Offset(0, 2),
                        color: Colors.black38,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
  },
  {
    path: 'widgets/game_card.dart',
    title: 'widgets/game_card.dart',
    description: '3D Card Container with icy-white #EBF4FA surface, 3px white border, and 6px #B8CDE0 bottom lip',
    code: `import 'package:flutter/material.dart';

class GameCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const GameCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(14),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: const Color(0xFFEBF4FA),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white, width: 3.0),
        boxShadow: const [
          BoxShadow(
            color: Color(0xFFB8CDE0),
            offset: Offset(0, 6),
            blurRadius: 0,
          ),
          BoxShadow(
            color: Colors.black26,
            offset: Offset(0, 10),
            blurRadius: 16,
          ),
        ],
      ),
      child: child,
    );
  }
}`,
  },
  {
    path: 'screens/main_shell_screen.dart',
    title: 'screens/main_shell_screen.dart',
    description: 'Persistent IndexedStack 4-Tab shell with strictly 2 top badges (1/10 Streak & 309 Trophies) and 82px bottom nav',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'lessons_tab.dart';
import 'battle_tab.dart';
import 'games_tab.dart';
import 'settings_tab.dart';

class MainShellScreen extends StatefulWidget {
  const MainShellScreen({super.key});

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF2B88D9),
              Color(0xFF145DA0),
            ],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Column(
            children: [
              // Persistent Top Status Bar (Strictly 2 Badges Only)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Left Badge (Streak: 1/10)
                    _buildStatusPill(
                      faceColor: const Color(0xFFE53935),
                      lipColor: const Color(0xFFAB000D),
                      icon: '🔥',
                      label: '1/10',
                    ),
                    // Right Badge (Trophies: 309)
                    _buildStatusPill(
                      faceColor: const Color(0xFFFFB300),
                      lipColor: const Color(0xFFC68400),
                      icon: '🏆',
                      label: '309',
                    ),
                  ],
                ),
              ),

              // Active Tab Viewport preserved via IndexedStack
              Expanded(
                child: IndexedStack(
                  index: _currentIndex,
                  children: const [
                    LessonsTab(),
                    BattleTab(),
                    GamesTab(),
                    SettingsTab(),
                  ],
                ),
              ),

              // Custom 4-Tab Game Navigation Bar (Height 82px)
              _buildBottomNavBar(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusPill({
    required Color faceColor,
    required Color lipColor,
    required String icon,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: faceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white30, width: 2),
        boxShadow: [
          BoxShadow(
            color: lipColor,
            offset: const Offset(0, 5),
            blurRadius: 0,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 8),
          Text(
            label,
            style: GoogleFonts.nunito(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w900,
              shadows: const [
                Shadow(offset: Offset(0, 2), color: Colors.black38),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavBar() {
    final items = [
      (icon: Icons.route_rounded, label: 'Lessons'),
      (icon: Icons.shield_rounded, label: '1v1 Battle'),
      (icon: Icons.sports_esports_rounded, label: 'Games'),
      (icon: Icons.settings_rounded, label: 'Settings'),
    ];

    return Container(
      height: 82,
      decoration: const BoxDecoration(
        color: Color(0xFF1976D2),
        border: Border(
          top: BorderSide(color: Color(0xFF64B5F6), width: 3),
        ),
      ),
      child: Row(
        children: List.generate(items.length, (index) {
          final isSelected = _currentIndex == index;
          final item = items[index];

          return Expanded(
            child: GestureDetector(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() => _currentIndex = index);
              },
              child: Transform.translate(
                offset: Offset(0, isSelected ? -10.0 : 0.0),
                child: Transform.scale(
                  scale: isSelected ? 1.15 : 1.0,
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? const LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Color(0xFFFFD54F),
                                Color(0xFFFF8F00),
                              ],
                            )
                          : null,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(item.icon, color: Colors.white, size: 30),
                        const SizedBox(height: 2),
                        Text(
                          item.label,
                          style: GoogleFonts.nunito(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            shadows: const [
                              Shadow(offset: Offset(0, 2), color: Colors.black45),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}`,
  },
  {
    path: 'screens/lessons_tab.dart',
    title: 'screens/lessons_tab.dart',
    description: 'Tab 1 Winding Lessons Map with S-Curve CustomPainter road, gold completed nodes, green Level 3 active node, and stone locked nodes',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class LessonsTab extends StatelessWidget {
  const LessonsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'LESSONS',
          style: GoogleFonts.nunito(
            color: Colors.white,
            fontSize: 32,
            fontWeight: FontWeight.w900,
            shadows: const [
              Shadow(offset: Offset(0, 3), color: Colors.black38),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF7CE876),
                  Color(0xFF52B718),
                  Color(0xFF38980E),
                ],
              ),
              borderRadius: BorderRadius.vertical(top: Radius.circular(34)),
            ),
            child: CustomPaint(
              painter: _WindingRoadPainter(),
              child: Stack(
                children: [
                  // Locked Level 5
                  Positioned(
                    right: 85,
                    top: 60,
                    child: _buildLockedNode('5'),
                  ),
                  // Locked Level 4
                  Positioned(
                    left: 85,
                    top: 145,
                    child: _buildLockedNode('4'),
                  ),
                  // Active Level 3 with floating START tooltip
                  Positioned(
                    right: 75,
                    top: 210,
                    child: _buildActiveNode(),
                  ),
                  // Completed Level 2
                  Positioned(
                    left: 115,
                    top: 300,
                    child: _buildCompletedNode('2'),
                  ),
                  // Completed Level 1
                  Positioned(
                    left: 65,
                    top: 375,
                    child: _buildCompletedNode('1'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCompletedNode(String level) {
    return Container(
      width: 68,
      height: 62,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: const Color(0xFFFFC800),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 3),
        boxShadow: const [
          BoxShadow(color: Color(0xFFD9A300), offset: Offset(0, 6)),
        ],
      ),
      child: Text(
        'Level\\n$level',
        textAlign: TextAlign.center,
        style: GoogleFonts.nunito(
          color: Colors.white,
          fontWeight: FontWeight.w900,
          fontSize: 13,
        ),
      ),
    );
  }

  Widget _buildActiveNode() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFFFF8C00),
            borderRadius: BorderRadius.circular(14),
            boxShadow: const [
              BoxShadow(color: Color(0xFFB85000), offset: Offset(0, 4)),
            ],
          ),
          child: Text(
            'START',
            style: GoogleFonts.nunito(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              fontSize: 16,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 78,
          height: 72,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: const Color(0xFF58CC02),
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 4),
            boxShadow: const [
              BoxShadow(color: Color(0xFF3C9600), offset: Offset(0, 6)),
              BoxShadow(color: Color(0x8858CC02), blurRadius: 20, spreadRadius: 4),
            ],
          ),
          child: Text(
            'Level\\n3',
            textAlign: TextAlign.center,
            style: GoogleFonts.nunito(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              fontSize: 16,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLockedNode(String level) {
    return Container(
      width: 64,
      height: 58,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: const Color(0xFF9E9E9E),
        shape: BoxShape.circle,
        boxShadow: const [
          BoxShadow(color: Color(0xFF707070), offset: Offset(0, 6)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.lock_rounded, color: Colors.white70, size: 18),
          Text(
            level,
            style: GoogleFonts.nunito(
              color: Colors.white,
              fontWeight: FontWeight.w900,
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }
}

class _WindingRoadPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final lockedPaint = Paint()
      ..color = const Color(0xFF9E9E9E)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 44
      ..strokeCap = StrokeCap.round;

    final completedPaint = Paint()
      ..color = const Color(0xFFFFB300)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 44
      ..strokeCap = StrokeCap.round;

    final lockedPath = Path()
      ..moveTo(size.width * 0.65, size.height * 0.48)
      ..cubicTo(
        size.width * 0.25,
        size.height * 0.38,
        size.width * 0.25,
        size.height * 0.24,
        size.width * 0.65,
        size.height * 0.14,
      );

    final completedPath = Path()
      ..moveTo(size.width * 0.52, size.height * 0.95)
      ..cubicTo(
        size.width * 0.20,
        size.height * 0.78,
        size.width * 0.35,
        size.height * 0.60,
        size.width * 0.65,
        size.height * 0.48,
      );

    canvas.drawPath(lockedPath, lockedPaint);
    canvas.drawPath(completedPath, completedPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}`,
  },
  {
    path: 'screens/battle_tab.dart',
    title: 'screens/battle_tab.dart',
    description: 'Tab 2 Minimalist 1v1 Battle Screen with 220x220 shield emblem and oversized 260x76 gold BATTLE button',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/game_button.dart';

class BattleTab extends StatelessWidget {
  const BattleTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          '1v1 BATTLE',
          style: GoogleFonts.nunito(
            color: Colors.white,
            fontSize: 32,
            fontWeight: FontWeight.w900,
            shadows: const [
              Shadow(offset: Offset(0, 3), color: Colors.black38),
            ],
          ),
        ),
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // 220x220 3D Split Red & Blue Shield with Crossed Broadswords
            Container(
              width: 220,
              height: 220,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.25),
                    blurRadius: 28,
                    offset: const Offset(0, 12),
                  ),
                ],
              ),
              child: const Icon(
                Icons.shield_rounded,
                size: 190,
                color: Color(0xFFECEFF1),
              ),
            ),
            const SizedBox(height: 32),
            // Primary CTA: Single Oversized Gold 3D GameButton (260x76)
            GameButton(
              label: 'BATTLE',
              style: GameButtonStyle.gold,
              width: 260,
              height: 76,
              fontSize: 34,
              onTap: () {},
            ),
          ],
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}`,
  },
  {
    path: 'screens/games_tab.dart',
    title: 'screens/games_tab.dart',
    description: 'Tab 3 Mini Games Screen with strictly one GameCard ("THE FLOOR IS LAVA!") and High Score 1000 badge',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/game_button.dart';
import '../widgets/game_card.dart';

class GamesTab extends StatelessWidget {
  const GamesTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18),
      child: Column(
        children: [
          Text(
            'MINI GAMES',
            style: GoogleFonts.nunito(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.w900,
              shadows: const [
                Shadow(offset: Offset(0, 3), color: Colors.black38),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Strictly One GameCard ("THE FLOOR IS LAVA!")
          GameCard(
            padding: const EdgeInsets.all(10),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Top Volcanic Banner
                Container(
                  height: 170,
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFFBF360C),
                        Color(0xFFFF5722),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'THE FLOOR IS LAVA!',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.nunito(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          shadows: const [
                            Shadow(offset: Offset(0, 3), color: Colors.black54),
                          ],
                        ),
                      ),
                      Align(
                        alignment: Alignment.bottomRight,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFB300),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            '🏆 High score: 1000',
                            style: GoogleFonts.nunito(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                // Bottom Icy-White Action Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Type fast to\\nclimb high!',
                        style: GoogleFonts.nunito(
                          color: const Color(0xFF14365D),
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          height: 1.15,
                        ),
                      ),
                      GameButton(
                        label: 'PLAY',
                        style: GameButtonStyle.gold,
                        width: 136,
                        height: 52,
                        fontSize: 20,
                        onTap: () {},
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'screens/settings_tab.dart',
    title: 'screens/settings_tab.dart',
    description: 'Tab 4 Profile & Settings with Abhimanyu LVL 12 profile card, achievement shelf, SFX slider, Music toggle, Language FR, and LOG OUT',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/game_button.dart';
import '../widgets/game_card.dart';

class SettingsTab extends StatefulWidget {
  const SettingsTab({super.key});

  @override
  State<SettingsTab> createState() => _SettingsTabState();
}

class _SettingsTabState extends State<SettingsTab> {
  double _sfxVolume = 0.6;
  bool _sfxEnabled = true;
  bool _musicEnabled = true;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
      child: Column(
        children: [
          Text(
            'PROFILE & SETTINGS',
            style: GoogleFonts.nunito(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w900,
              shadows: const [
                Shadow(offset: Offset(0, 3), color: Colors.black38),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Player Profile Card
          GameCard(
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 78,
                      height: 82,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFB300),
                        borderRadius: BorderRadius.circular(18),
                      ),
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.person_rounded,
                        size: 52,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Abhimanyu',
                            style: GoogleFonts.nunito(
                              color: const Color(0xFF14365D),
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          Text(
                            '@abhimanyu',
                            style: GoogleFonts.nunito(
                              color: const Color(0xFF3B5C85),
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'LVL 12',
                            style: GoogleFonts.nunito(
                              color: const Color(0xFF14365D),
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'XP 1,425 / 2,000',
                            style: GoogleFonts.nunito(
                              color: const Color(0xFF58CC02),
                              fontSize: 13,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Achievement Shelf
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFC5D9EB),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Text('🏆', style: TextStyle(fontSize: 30)),
                      Text('⚔️', style: TextStyle(fontSize: 30)),
                      Text('🔥', style: TextStyle(fontSize: 30)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Sound Effects Row
          GameCard(
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'SOUND EFFECTS',
                      style: GoogleFonts.nunito(
                        color: const Color(0xFF14365D),
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => _sfxEnabled = !_sfxEnabled),
                      child: Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: const Color(0xFF58CC02),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.check, color: Colors.white, size: 18),
                      ),
                    ),
                  ],
                ),
                Slider(
                  value: _sfxVolume,
                  onChanged: (val) => setState(() => _sfxVolume = val),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Music Row
          GameCard(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'MUSIC',
                  style: GoogleFonts.nunito(
                    color: const Color(0xFF14365D),
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                GestureDetector(
                  onTap: () => setState(() => _musicEnabled = !_musicEnabled),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF58CC02),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _musicEnabled ? 'ON' : 'OFF',
                      style: GoogleFonts.nunito(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Language Row
          GameCard(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'LANGUAGE',
                  style: GoogleFonts.nunito(
                    color: const Color(0xFF14365D),
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const Text('🇫🇷', style: TextStyle(fontSize: 26)),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Footer Button: Full-Width Crimson-Red "LOG OUT"
          GameButton(
            label: 'LOG OUT',
            style: GameButtonStyle.danger,
            height: 54,
            fontSize: 20,
            onTap: () {},
          ),
        ],
      ),
    );
  }
}`,
  },
];
