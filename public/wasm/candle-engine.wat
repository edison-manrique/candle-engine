(module
 (type $0 (func (result i32)))
 (type $1 (func))
 (type $2 (func (param f32) (result f32)))
 (type $3 (func (param f64) (result f64)))
 (type $4 (func (param f32 f32 f32 f32 f64)))
 (type $5 (func (param i32) (result i32)))
 (type $6 (func (param i32 i32 i32 i32 i32)))
 (type $7 (func (param f32 f32 f32 f32 i32 f32) (result i32)))
 (type $8 (func (param i32 i32 i32 i32)))
 (type $9 (func (param f64 f32 f32 f32 f32 f32) (result i32)))
 (global $assembly/arena/Arena.current (mut i32) (i32.const 0))
 (global $assembly/engine/rsiBaseGain (mut f64) (f64.const 0))
 (global $assembly/engine/rsiBaseLoss (mut f64) (f64.const 0))
 (global $assembly/engine/rsiCurGain (mut f64) (f64.const 0))
 (global $assembly/engine/rsiCurLoss (mut f64) (f64.const 0))
 (global $assembly/engine/rsiStateIdx (mut i32) (i32.const -1))
 (global $~lib/util/math/log_tail (mut f64) (f64.const 0))
 (memory $0 16 16)
 (data $1 (i32.const 990976) "\be\f3\f8y\eca\f6?\de\aa\8c\80\f7{\d5\bf=\88\afJ\edq\f5?\dbm\c0\a7\f0\be\d2\bf\b0\10\f0\f09\95\f4?g:Q\7f\ae\1e\d0\bf\85\03\b8\b0\95\c9\f3?\e9$\82\a6\d81\cb\bf\a5d\88\0c\19\r\f3?Xw\c0\nOW\c6\bf\a0\8e\0b{\"^\f2?\00\81\9c\c7+\aa\c1\bf?4\1aJJ\bb\f1?^\0e\8c\cevN\ba\bf\ba\e5\8a\f0X#\f1?\cc\1caZ<\97\b1\bf\a7\00\99A?\95\f0?\1e\0c\e18\f4R\a2\bf\00\00\00\00\00\00\f0?\00\00\00\00\00\00\00\00\acG\9a\fd\8c`\ee?\84Y\f2]\aa\a5\aa?\a0j\02\1f\b3\a4\ec?\b4.6\aaS^\bc?\e6\fcjW6 \eb?\08\db w\e5&\c5?-\aa\a1c\d1\c2\e9?pG\"\r\86\c2\cb?\edAx\03\e6\86\e8?\e1~\a0\c8\8b\05\d1?bHS\f5\dcg\e7?\t\ee\b6W0\04\d4?")
 (data $2 (i32.const 991238) "\f0?t\85\15\d3\b0\d9\ef?\0f\89\f9lX\b5\ef?Q[\12\d0\01\93\ef?{Q}<\b8r\ef?\aa\b9h1\87T\ef?8bunz8\ef?\e1\de\1f\f5\9d\1e\ef?\15\b71\n\fe\06\ef?\cb\a9:7\a7\f1\ee?\"4\12L\a6\de\ee?-\89a`\08\ce\ee?\'*6\d5\da\bf\ee?\82O\9dV+\b4\ee?)TH\dd\07\ab\ee?\85U:\b0~\a4\ee?\cd;\7ff\9e\a0\ee?t_\ec\e8u\9f\ee?\87\01\ebs\14\a1\ee?\13\ceL\99\89\a5\ee?\db\a0*B\e5\ac\ee?\e5\c5\cd\b07\b7\ee?\90\f0\a3\82\91\c4\ee?]%>\b2\03\d5\ee?\ad\d3Z\99\9f\e8\ee?G^\fb\f2v\ff\ee?\9cR\85\dd\9b\19\ef?i\90\ef\dc 7\ef?\87\a4\fb\dc\18X\ef?_\9b{3\97|\ef?\da\90\a4\a2\af\a4\ef?@En[v\d0\ef?")
 (data $3 (i32.const 991493) "\a0\f6?")
 (data $3.1 (i32.const 991505) "\c8\b9\f2\82,\d6\bf\80V7($\b4\fa<\00\00\00\00\00\80\f6?")
 (data $3.2 (i32.const 991537) "\08X\bf\bd\d1\d5\bf \f7\e0\d8\08\a5\1c\bd\00\00\00\00\00`\f6?")
 (data $3.3 (i32.const 991569) "XE\17wv\d5\bfmP\b6\d5\a4b#\bd\00\00\00\00\00@\f6?")
 (data $3.4 (i32.const 991601) "\f8-\87\ad\1a\d5\bf\d5g\b0\9e\e4\84\e6\bc\00\00\00\00\00 \f6?")
 (data $3.5 (i32.const 991633) "xw\95_\be\d4\bf\e0>)\93i\1b\04\bd\00\00\00\00\00\00\f6?")
 (data $3.6 (i32.const 991665) "`\1c\c2\8ba\d4\bf\cc\84LH/\d8\13=\00\00\00\00\00\e0\f5?")
 (data $3.7 (i32.const 991697) "\a8\86\860\04\d4\bf:\0b\82\ed\f3B\dc<\00\00\00\00\00\c0\f5?")
 (data $3.8 (i32.const 991729) "HiUL\a6\d3\bf`\94Q\86\c6\b1 =\00\00\00\00\00\a0\f5?")
 (data $3.9 (i32.const 991761) "\80\98\9a\ddG\d3\bf\92\80\c5\d4MY%=\00\00\00\00\00\80\f5?")
 (data $3.10 (i32.const 991793) " \e1\ba\e2\e8\d2\bf\d8+\b7\99\1e{&=\00\00\00\00\00`\f5?")
 (data $3.11 (i32.const 991825) "\88\de\13Z\89\d2\bf?\b0\cf\b6\14\ca\15=\00\00\00\00\00`\f5?")
 (data $3.12 (i32.const 991857) "\88\de\13Z\89\d2\bf?\b0\cf\b6\14\ca\15=\00\00\00\00\00@\f5?")
 (data $3.13 (i32.const 991889) "x\cf\fbA)\d2\bfv\daS($Z\16\bd\00\00\00\00\00 \f5?")
 (data $3.14 (i32.const 991921) "\98i\c1\98\c8\d1\bf\04T\e7h\bc\af\1f\bd\00\00\00\00\00\00\f5?")
 (data $3.15 (i32.const 991953) "\a8\ab\ab\\g\d1\bf\f0\a8\823\c6\1f\1f=\00\00\00\00\00\e0\f4?")
 (data $3.16 (i32.const 991985) "H\ae\f9\8b\05\d1\bffZ\05\fd\c4\a8&\bd\00\00\00\00\00\c0\f4?")
 (data $3.17 (i32.const 992017) "\90s\e2$\a3\d0\bf\0e\03\f4~\eek\0c\bd\00\00\00\00\00\a0\f4?")
 (data $3.18 (i32.const 992049) "\d0\b4\94%@\d0\bf\7f-\f4\9e\b86\f0\bc\00\00\00\00\00\a0\f4?")
 (data $3.19 (i32.const 992081) "\d0\b4\94%@\d0\bf\7f-\f4\9e\b86\f0\bc\00\00\00\00\00\80\f4?")
 (data $3.20 (i32.const 992113) "@^m\18\b9\cf\bf\87<\99\ab*W\r=\00\00\00\00\00`\f4?")
 (data $3.21 (i32.const 992145) "`\dc\cb\ad\f0\ce\bf$\af\86\9c\b7&+=\00\00\00\00\00@\f4?")
 (data $3.22 (i32.const 992177) "\f0*n\07\'\ce\bf\10\ff?TO/\17\bd\00\00\00\00\00 \f4?")
 (data $3.23 (i32.const 992209) "\c0Ok!\\\cd\bf\1bh\ca\bb\91\ba!=\00\00\00\00\00\00\f4?")
 (data $3.24 (i32.const 992241) "\a0\9a\c7\f7\8f\cc\bf4\84\9fhOy\'=\00\00\00\00\00\00\f4?")
 (data $3.25 (i32.const 992273) "\a0\9a\c7\f7\8f\cc\bf4\84\9fhOy\'=\00\00\00\00\00\e0\f3?")
 (data $3.26 (i32.const 992305) "\90-t\86\c2\cb\bf\8f\b7\8b1\b0N\19=\00\00\00\00\00\c0\f3?")
 (data $3.27 (i32.const 992337) "\c0\80N\c9\f3\ca\bff\90\cd?cN\ba<\00\00\00\00\00\a0\f3?")
 (data $3.28 (i32.const 992369) "\b0\e2\1f\bc#\ca\bf\ea\c1F\dcd\8c%\bd\00\00\00\00\00\a0\f3?")
 (data $3.29 (i32.const 992401) "\b0\e2\1f\bc#\ca\bf\ea\c1F\dcd\8c%\bd\00\00\00\00\00\80\f3?")
 (data $3.30 (i32.const 992433) "P\f4\9cZR\c9\bf\e3\d4\c1\04\d9\d1*\bd\00\00\00\00\00`\f3?")
 (data $3.31 (i32.const 992465) "\d0 e\a0\7f\c8\bf\t\fa\db\7f\bf\bd+=\00\00\00\00\00@\f3?")
 (data $3.32 (i32.const 992497) "\e0\10\02\89\ab\c7\bfXJSr\90\db+=\00\00\00\00\00@\f3?")
 (data $3.33 (i32.const 992529) "\e0\10\02\89\ab\c7\bfXJSr\90\db+=\00\00\00\00\00 \f3?")
 (data $3.34 (i32.const 992561) "\d0\19\e7\0f\d6\c6\bff\e2\b2\a3j\e4\10\bd\00\00\00\00\00\00\f3?")
 (data $3.35 (i32.const 992593) "\90\a7p0\ff\c5\bf9P\10\9fC\9e\1e\bd\00\00\00\00\00\00\f3?")
 (data $3.36 (i32.const 992625) "\90\a7p0\ff\c5\bf9P\10\9fC\9e\1e\bd\00\00\00\00\00\e0\f2?")
 (data $3.37 (i32.const 992657) "\b0\a1\e3\e5&\c5\bf\8f[\07\90\8b\de \bd\00\00\00\00\00\c0\f2?")
 (data $3.38 (i32.const 992689) "\80\cbl+M\c4\bf<x5a\c1\0c\17=\00\00\00\00\00\c0\f2?")
 (data $3.39 (i32.const 992721) "\80\cbl+M\c4\bf<x5a\c1\0c\17=\00\00\00\00\00\a0\f2?")
 (data $3.40 (i32.const 992753) "\90\1e \fcq\c3\bf:T\'M\86x\f1<\00\00\00\00\00\80\f2?")
 (data $3.41 (i32.const 992785) "\f0\1f\f8R\95\c2\bf\08\c4q\170\8d$\bd\00\00\00\00\00`\f2?")
 (data $3.42 (i32.const 992817) "`/\d5*\b7\c1\bf\96\a3\11\18\a4\80.\bd\00\00\00\00\00`\f2?")
 (data $3.43 (i32.const 992849) "`/\d5*\b7\c1\bf\96\a3\11\18\a4\80.\bd\00\00\00\00\00@\f2?")
 (data $3.44 (i32.const 992881) "\90\d0|~\d7\c0\bf\f4[\e8\88\96i\n=\00\00\00\00\00@\f2?")
 (data $3.45 (i32.const 992913) "\90\d0|~\d7\c0\bf\f4[\e8\88\96i\n=\00\00\00\00\00 \f2?")
 (data $3.46 (i32.const 992945) "\e0\db1\91\ec\bf\bf\f23\a3\\Tu%\bd\00\00\00\00\00\00\f2?")
 (data $3.47 (i32.const 992978) "+n\07\'\be\bf<\00\f0*,4*=\00\00\00\00\00\00\f2?")
 (data $3.48 (i32.const 993010) "+n\07\'\be\bf<\00\f0*,4*=\00\00\00\00\00\e0\f1?")
 (data $3.49 (i32.const 993041) "\c0[\8fT^\bc\bf\06\be_XW\0c\1d\bd\00\00\00\00\00\c0\f1?")
 (data $3.50 (i32.const 993073) "\e0J:m\92\ba\bf\c8\aa[\e859%=\00\00\00\00\00\c0\f1?")
 (data $3.51 (i32.const 993105) "\e0J:m\92\ba\bf\c8\aa[\e859%=\00\00\00\00\00\a0\f1?")
 (data $3.52 (i32.const 993137) "\a01\d6E\c3\b8\bfhV/M)|\13=\00\00\00\00\00\a0\f1?")
 (data $3.53 (i32.const 993169) "\a01\d6E\c3\b8\bfhV/M)|\13=\00\00\00\00\00\80\f1?")
 (data $3.54 (i32.const 993201) "`\e5\8a\d2\f0\b6\bf\das3\c97\97&\bd\00\00\00\00\00`\f1?")
 (data $3.55 (i32.const 993233) " \06?\07\1b\b5\bfW^\c6a[\02\1f=\00\00\00\00\00`\f1?")
 (data $3.56 (i32.const 993265) " \06?\07\1b\b5\bfW^\c6a[\02\1f=\00\00\00\00\00@\f1?")
 (data $3.57 (i32.const 993297) "\e0\1b\96\d7A\b3\bf\df\13\f9\cc\da^,=\00\00\00\00\00@\f1?")
 (data $3.58 (i32.const 993329) "\e0\1b\96\d7A\b3\bf\df\13\f9\cc\da^,=\00\00\00\00\00 \f1?")
 (data $3.59 (i32.const 993361) "\80\a3\ee6e\b1\bf\t\a3\8fv^|\14=\00\00\00\00\00\00\f1?")
 (data $3.60 (i32.const 993393) "\80\11\c00\n\af\bf\91\8e6\83\9eY-=\00\00\00\00\00\00\f1?")
 (data $3.61 (i32.const 993425) "\80\11\c00\n\af\bf\91\8e6\83\9eY-=\00\00\00\00\00\e0\f0?")
 (data $3.62 (i32.const 993457) "\80\19q\ddB\ab\bfLp\d6\e5z\82\1c=\00\00\00\00\00\e0\f0?")
 (data $3.63 (i32.const 993489) "\80\19q\ddB\ab\bfLp\d6\e5z\82\1c=\00\00\00\00\00\c0\f0?")
 (data $3.64 (i32.const 993521) "\c02\f6Xt\a7\bf\ee\a1\f24F\fc,\bd\00\00\00\00\00\c0\f0?")
 (data $3.65 (i32.const 993553) "\c02\f6Xt\a7\bf\ee\a1\f24F\fc,\bd\00\00\00\00\00\a0\f0?")
 (data $3.66 (i32.const 993585) "\c0\fe\b9\87\9e\a3\bf\aa\fe&\f5\b7\02\f5<\00\00\00\00\00\a0\f0?")
 (data $3.67 (i32.const 993617) "\c0\fe\b9\87\9e\a3\bf\aa\fe&\f5\b7\02\f5<\00\00\00\00\00\80\f0?")
 (data $3.68 (i32.const 993650) "x\0e\9b\82\9f\bf\e4\t~|&\80)\bd\00\00\00\00\00\80\f0?")
 (data $3.69 (i32.const 993682) "x\0e\9b\82\9f\bf\e4\t~|&\80)\bd\00\00\00\00\00`\f0?")
 (data $3.70 (i32.const 993713) "\80\d5\07\1b\b9\97\bf9\a6\fa\93T\8d(\bd\00\00\00\00\00@\f0?")
 (data $3.71 (i32.const 993746) "\fc\b0\a8\c0\8f\bf\9c\a6\d3\f6|\1e\df\bc\00\00\00\00\00@\f0?")
 (data $3.72 (i32.const 993778) "\fc\b0\a8\c0\8f\bf\9c\a6\d3\f6|\1e\df\bc\00\00\00\00\00 \f0?")
 (data $3.73 (i32.const 993810) "\10k*\e0\7f\bf\e4@\da\r?\e2\19\bd\00\00\00\00\00 \f0?")
 (data $3.74 (i32.const 993842) "\10k*\e0\7f\bf\e4@\da\r?\e2\19\bd\00\00\00\00\00\00\f0?")
 (data $3.75 (i32.const 993894) "\f0?")
 (data $3.76 (i32.const 993925) "\c0\ef?")
 (data $3.77 (i32.const 993938) "\89u\15\10\80?\e8+\9d\99k\c7\10\bd\00\00\00\00\00\80\ef?")
 (data $3.78 (i32.const 993969) "\80\93XV \90?\d2\f7\e2\06[\dc#\bd\00\00\00\00\00@\ef?")
 (data $3.79 (i32.const 994002) "\c9(%I\98?4\0cZ2\ba\a0*\bd\00\00\00\00\00\00\ef?")
 (data $3.80 (i32.const 994033) "@\e7\89]A\a0?S\d7\f1\\\c0\11\01=\00\00\00\00\00\c0\ee?")
 (data $3.81 (i32.const 994066) ".\d4\aef\a4?(\fd\bdus\16,\bd\00\00\00\00\00\80\ee?")
 (data $3.82 (i32.const 994097) "\c0\9f\14\aa\94\a8?}&Z\d0\95y\19\bd\00\00\00\00\00@\ee?")
 (data $3.83 (i32.const 994129) "\c0\dd\cds\cb\ac?\07(\d8G\f2h\1a\bd\00\00\00\00\00 \ee?")
 (data $3.84 (i32.const 994161) "\c0\06\c01\ea\ae?{;\c9O>\11\0e\bd\00\00\00\00\00\e0\ed?")
 (data $3.85 (i32.const 994193) "`F\d1;\97\b1?\9b\9e\rV]2%\bd\00\00\00\00\00\a0\ed?")
 (data $3.86 (i32.const 994225) "\e0\d1\a7\f5\bd\b3?\d7N\db\a5^\c8,=\00\00\00\00\00`\ed?")
 (data $3.87 (i32.const 994257) "\a0\97MZ\e9\b5?\1e\1d]<\06i,\bd\00\00\00\00\00@\ed?")
 (data $3.88 (i32.const 994289) "\c0\ea\n\d3\00\b7?2\ed\9d\a9\8d\1e\ec<\00\00\00\00\00\00\ed?")
 (data $3.89 (i32.const 994321) "@Y]^3\b9?\daG\bd:\\\11#=\00\00\00\00\00\c0\ec?")
 (data $3.90 (i32.const 994353) "`\ad\8d\c8j\bb?\e5h\f7+\80\90\13\bd\00\00\00\00\00\a0\ec?")
 (data $3.91 (i32.const 994385) "@\bc\01X\88\bc?\d3\acZ\c6\d1F&=\00\00\00\00\00`\ec?")
 (data $3.92 (i32.const 994417) " \n\839\c7\be?\e0E\e6\afh\c0-\bd\00\00\00\00\00@\ec?")
 (data $3.93 (i32.const 994449) "\e0\db9\91\e8\bf?\fd\n\a1O\d64%\bd\00\00\00\00\00\00\ec?")
 (data $3.94 (i32.const 994481) "\e0\'\82\8e\17\c1?\f2\07-\cex\ef!=\00\00\00\00\00\e0\eb?")
 (data $3.95 (i32.const 994513) "\f0#~+\aa\c1?4\998D\8e\a7,=\00\00\00\00\00\a0\eb?")
 (data $3.96 (i32.const 994545) "\80\86\0ca\d1\c2?\a1\b4\81\cbl\9d\03=\00\00\00\00\00\80\eb?")
 (data $3.97 (i32.const 994577) "\90\15\b0\fce\c3?\89rK#\a8/\c6<\00\00\00\00\00@\eb?")
 (data $3.98 (i32.const 994609) "\b03\83=\91\c4?x\b6\fdTy\83%=\00\00\00\00\00 \eb?")
 (data $3.99 (i32.const 994641) "\b0\a1\e4\e5\'\c5?\c7}i\e5\e83&=\00\00\00\00\00\e0\ea?")
 (data $3.100 (i32.const 994673) "\10\8c\beNW\c6?x.<,\8b\cf\19=\00\00\00\00\00\c0\ea?")
 (data $3.101 (i32.const 994705) "pu\8b\12\f0\c6?\e1!\9c\e5\8d\11%\bd\00\00\00\00\00\a0\ea?")
 (data $3.102 (i32.const 994737) "PD\85\8d\89\c7?\05C\91p\10f\1c\bd\00\00\00\00\00`\ea?")
 (data $3.103 (i32.const 994770) "9\eb\af\be\c8?\d1,\e9\aaT=\07\bd\00\00\00\00\00@\ea?")
 (data $3.104 (i32.const 994802) "\f7\dcZZ\c9?o\ff\a0X(\f2\07=\00\00\00\00\00\00\ea?")
 (data $3.105 (i32.const 994833) "\e0\8a<\ed\93\ca?i!VPCr(\bd\00\00\00\00\00\e0\e9?")
 (data $3.106 (i32.const 994865) "\d0[W\d81\cb?\aa\e1\acN\8d5\0c\bd\00\00\00\00\00\c0\e9?")
 (data $3.107 (i32.const 994897) "\e0;8\87\d0\cb?\b6\12TY\c4K-\bd\00\00\00\00\00\a0\e9?")
 (data $3.108 (i32.const 994929) "\10\f0\c6\fbo\cc?\d2+\96\c5r\ec\f1\bc\00\00\00\00\00`\e9?")
 (data $3.109 (i32.const 994961) "\90\d4\b0=\b1\cd?5\b0\15\f7*\ff*\bd\00\00\00\00\00@\e9?")
 (data $3.110 (i32.const 994993) "\10\e7\ff\0eS\ce?0\f4A`\'\12\c2<\00\00\00\00\00 \e9?")
 (data $3.111 (i32.const 995026) "\dd\e4\ad\f5\ce?\11\8e\bbe\15!\ca\bc\00\00\00\00\00\00\e9?")
 (data $3.112 (i32.const 995057) "\b0\b3l\1c\99\cf?0\df\0c\ca\ec\cb\1b=\00\00\00\00\00\c0\e8?")
 (data $3.113 (i32.const 995089) "XM`8q\d0?\91N\ed\16\db\9c\f8<\00\00\00\00\00\a0\e8?")
 (data $3.114 (i32.const 995121) "`ag-\c4\d0?\e9\ea<\16\8b\18\'=\00\00\00\00\00\80\e8?")
 (data $3.115 (i32.const 995153) "\e8\'\82\8e\17\d1?\1c\f0\a5c\0e!,\bd\00\00\00\00\00`\e8?")
 (data $3.116 (i32.const 995185) "\f8\ac\cb\\k\d1?\81\16\a5\f7\cd\9a+=\00\00\00\00\00@\e8?")
 (data $3.117 (i32.const 995217) "hZc\99\bf\d1?\b7\bdGQ\ed\a6,=\00\00\00\00\00 \e8?")
 (data $3.118 (i32.const 995249) "\b8\0emE\14\d2?\ea\baF\ba\de\87\n=\00\00\00\00\00\e0\e7?")
 (data $3.119 (i32.const 995281) "\90\dc|\f0\be\d2?\f4\04PJ\fa\9c*=\00\00\00\00\00\c0\e7?")
 (data $3.120 (i32.const 995313) "`\d3\e1\f1\14\d3?\b8<!\d3z\e2(\bd\00\00\00\00\00\a0\e7?")
 (data $3.121 (i32.const 995345) "\10\bevgk\d3?\c8w\f1\b0\cdn\11=\00\00\00\00\00\80\e7?")
 (data $3.122 (i32.const 995377) "03wR\c2\d3?\\\bd\06\b6T;\18=\00\00\00\00\00`\e7?")
 (data $3.123 (i32.const 995409) "\e8\d5#\b4\19\d4?\9d\e0\90\ec6\e4\08=\00\00\00\00\00@\e7?")
 (data $3.124 (i32.const 995441) "\c8q\c2\8dq\d4?u\d6g\t\ce\'/\bd\00\00\00\00\00 \e7?")
 (data $3.125 (i32.const 995473) "0\17\9e\e0\c9\d4?\a4\d8\n\1b\89 .\bd\00\00\00\00\00\00\e7?")
 (data $3.126 (i32.const 995505) "\a08\07\ae\"\d5?Y\c7d\81p\be.=\00\00\00\00\00\e0\e6?")
 (data $3.127 (i32.const 995537) "\d0\c8S\f7{\d5?\ef@]\ee\ed\ad\1f=\00\00\00\00\00\c0\e6?")
 (data $3.128 (i32.const 995569) "`Y\df\bd\d5\d5?\dce\a4\08*\0b\n\bd")
 (data $4 (i32.const 995598) "\f0?n\bf\88\1aO;\9b<53\fb\a9=\f6\ef?]\dc\d8\9c\13`q\bca\80w>\9a\ec\ef?\d1f\87\10z^\90\bc\85\7fn\e8\15\e3\ef?\13\f6g5R\d2\8c<t\85\15\d3\b0\d9\ef?\fa\8e\f9#\80\ce\8b\bc\de\f6\dd)k\d0\ef?a\c8\e6aN\f7`<\c8\9bu\18E\c7\ef?\99\d33[\e4\a3\90<\83\f3\c6\ca>\be\ef?m{\83]\a6\9a\97<\0f\89\f9lX\b5\ef?\fc\ef\fd\92\1a\b5\8e<\f7Gr+\92\ac\ef?\d1\9c/p=\be><\a2\d1\d32\ec\a3\ef?\0bn\90\894\03j\bc\1b\d3\fe\aff\9b\ef?\0e\bd/*RV\95\bcQ[\12\d0\01\93\ef?U\eaN\8c\ef\80P\bc\cc1l\c0\bd\8a\ef?\16\f4\d5\b9#\c9\91\bc\e0-\a9\ae\9a\82\ef?\afU\\\e9\e3\d3\80<Q\8e\a5\c8\98z\ef?H\93\a5\ea\15\1b\80\bc{Q}<\b8r\ef?=2\deU\f0\1f\8f\bc\ea\8d\8c8\f9j\ef?\bfS\13?\8c\89\8b<u\cbo\eb[c\ef?&\eb\11v\9c\d9\96\bc\d4\\\04\84\e0[\ef?`/:>\f7\ec\9a<\aa\b9h1\87T\ef?\9d8\86\cb\82\e7\8f\bc\1d\d9\fc\"PM\ef?\8d\c3\a6DAo\8a<\d6\8cb\88;F\ef?}\04\e4\b0\05z\80<\96\dc}\91I?\ef?\94\a8\a8\e3\fd\8e\96<8bunz8\ef?}Ht\f2\18^\87<?\a6\b2O\ce1\ef?\f2\e7\1f\98+G\80<\dd|\e2eE+\ef?^\08q?{\b8\96\bc\81c\f5\e1\df$\ef?1\ab\tm\e1\f7\82<\e1\de\1f\f5\9d\1e\ef?\fa\bfo\1a\9b!=\bc\90\d9\da\d0\7f\18\ef?\b4\n\0cr\827\8b<\0b\03\e4\a6\85\12\ef?\8f\cb\ce\89\92\14n<V/>\a9\af\0c\ef?\b6\ab\b0MuM\83<\15\b71\n\fe\06\ef?Lt\ac\e2\01B\86<1\d8L\fcp\01\ef?J\f8\d3]9\dd\8f<\ff\16d\b2\08\fc\ee?\04[\8e;\80\a3\86\bc\f1\9f\92_\c5\f6\ee?hPK\cc\edJ\92\bc\cb\a9:7\a7\f1\ee?\8e-Q\1b\f8\07\99\bcf\d8\05m\ae\ec\ee?\d26\94>\e8\d1q\bc\f7\9f\e54\db\e7\ee?\15\1b\ce\b3\19\19\99\bc\e5\a8\13\c3-\e3\ee?mL*\a7H\9f\85<\"4\12L\a6\de\ee?\8ai(z`\12\93\bc\1c\80\ac\04E\da\ee?[\89\17H\8f\a7X\bc*.\f7!\n\d6\ee?\1b\9aIg\9b,|\bc\97\a8P\d9\f5\d1\ee?\11\ac\c2`\edcC<-\89a`\08\ce\ee?\efd\06;\tf\96<W\00\1d\edA\ca\ee?y\03\a1\da\e1\ccn<\d0<\c1\b5\a2\c6\ee?0\12\0f?\8e\ff\93<\de\d3\d7\f0*\c3\ee?\b0\afz\bb\ce\90v<\'*6\d5\da\bf\ee?w\e0T\eb\bd\1d\93<\r\dd\fd\99\b2\bc\ee?\8e\a3q\004\94\8f\bc\a7,\9dv\b2\b9\ee?I\a3\93\dc\cc\de\87\bcBf\cf\a2\da\b6\ee?_8\0f\bd\c6\dex\bc\82O\9dV+\b4\ee?\f6\\{\ecF\12\86\bc\0f\92]\ca\a4\b1\ee?\8e\d7\fd\18\055\93<\da\'\b56G\af\ee?\05\9b\8a/\b7\98{<\fd\c7\97\d4\12\ad\ee?\tT\1c\e2\e1c\90<)TH\dd\07\ab\ee?\ea\c6\19P\85\c74<\b7FY\8a&\a9\ee?5\c0d+\e62\94<H!\ad\15o\a7\ee?\9fv\99aJ\e4\8c\bc\t\dcv\b9\e1\a5\ee?\a8M\ef;\c53\8c\bc\85U:\b0~\a4\ee?\ae\e9+\89xS\84\bc \c3\cc4F\a3\ee?XXVx\dd\ce\93\bc%\"U\828\a2\ee?d\19~\80\aa\10W<s\a9L\d4U\a1\ee?(\"^\bf\ef\b3\93\bc\cd;\7ff\9e\a0\ee?\82\b94\87\ad\12j\bc\bf\da\0bu\12\a0\ee?\ee\a9m\b8\efgc\bc/\1ae<\b2\9f\ee?Q\88\e0T=\dc\80\bc\84\94Q\f9}\9f\ee?\cf>Z~d\1fx\bct_\ec\e8u\9f\ee?\b0}\8b\c0J\ee\86\bct\81\a5H\9a\9f\ee?\8a\e6U\1e2\19\86\bc\c9gBV\eb\9f\ee?\d3\d4\t^\cb\9c\90<?]\deOi\a0\ee?\1d\a5M\b9\dc2{\bc\87\01\ebs\14\a1\ee?k\c0gT\fd\ec\94<2\c10\01\ed\a1\ee?Ul\d6\ab\e1\ebe<bN\cf6\f3\a2\ee?B\cf\b3/\c5\a1\88\bc\12\1a>T\'\a4\ee?47;\f1\b6i\93\bc\13\ceL\99\89\a5\ee?\1e\ff\19:\84^\80\bc\ad\c7#F\1a\a7\ee?nWr\d8P\d4\94\bc\ed\92D\9b\d9\a8\ee?\00\8a\0e[g\ad\90<\99f\8a\d9\c7\aa\ee?\b4\ea\f0\c1/\b7\8d<\db\a0*B\e5\ac\ee?\ff\e7\c5\9c`\b6e\bc\8cD\b5\162\af\ee?D_\f3Y\83\f6{<6w\15\99\ae\b1\ee?\83=\1e\a7\1f\t\93\bc\c6\ff\91\0b[\b4\ee?)\1el\8b\b8\a9]\bc\e5\c5\cd\b07\b7\ee?Y\b9\90|\f9#l\bc\0fR\c8\cbD\ba\ee?\aa\f9\f4\"CC\92\bcPN\de\9f\82\bd\ee?K\8ef\d7l\ca\85\bc\ba\07\cap\f1\c0\ee?\'\ce\91+\fc\afq<\90\f0\a3\82\91\c4\ee?\bbs\n\e15\d2m<##\e3\19c\c8\ee?c\"b\"\04\c5\87\bce\e5]{f\cc\ee?\d51\e2\e3\86\1c\8b<3-J\ec\9b\d0\ee?\15\bb\bc\d3\d1\bb\91\bc]%>\b2\03\d5\ee?\d21\ee\9c1\cc\90<X\b30\13\9e\d9\ee?\b3Zsn\84i\84<\bf\fdyUk\de\ee?\b4\9d\8e\97\cd\df\82\bcz\f3\d3\bfk\e3\ee?\873\cb\92w\1a\8c<\ad\d3Z\99\9f\e8\ee?\fa\d9\d1J\8f{\90\bcf\b6\8d)\07\ee\ee?\ba\ae\dcV\d9\c3U\bc\fb\15O\b8\a2\f3\ee?@\f6\a6=\0e\a4\90\bc:Y\e5\8dr\f9\ee?4\93\ad8\f4\d6h\bcG^\fb\f2v\ff\ee?5\8aXk\e2\ee\91\bcJ\06\a10\b0\05\ef?\cd\dd_\n\d7\fft<\d2\c1K\90\1e\0c\ef?\ac\98\92\fa\fb\bd\91\bc\t\1e\d7[\c2\12\ef?\b3\0c\af0\aens<\9cR\85\dd\9b\19\ef?\94\fd\9f\\2\e3\8e<z\d0\ff_\ab \ef?\acY\t\d1\8f\e0\84<K\d1W.\f1\'\ef?g\1aN8\af\cdc<\b5\e7\06\94m/\ef?h\19\92l,kg<i\90\ef\dc 7\ef?\d2\b5\cc\83\18\8a\80\bc\fa\c3]U\0b?\ef?o\fa\ff?]\ad\8f\bc|\89\07J-G\ef?I\a9u8\ae\r\90\bc\f2\89\r\08\87O\ef?\a7\07=\a6\85\a3t<\87\a4\fb\dc\18X\ef?\0f\"@ \9e\91\82\bc\98\83\c9\16\e3`\ef?\ac\92\c1\d5PZ\8e<\852\db\03\e6i\ef?Kk\01\acY:\84<`\b4\01\f3!s\ef?\1f>\b4\07!\d5\82\bc_\9b{3\97|\ef?\c9\rG;\b9*\89\bc)\a1\f5\14F\86\ef?\d3\88:`\04\b6t<\f6?\8b\e7.\90\ef?qr\9dQ\ec\c5\83<\83L\c7\fbQ\9a\ef?\f0\91\d3\8f\12\f7\8f\bc\da\90\a4\a2\af\a4\ef?}t#\e2\98\ae\8d\bc\f1g\8e-H\af\ef?\08 \aaA\bc\c3\8e<\'Za\ee\1b\ba\ef?2\eb\a9\c3\94+\84<\97\bak7+\c5\ef?\ee\85\d11\a9d\8a<@En[v\d0\ef?\ed\e3;\e4\ba7\8e\bc\14\be\9c\ad\fd\db\ef?\9d\cd\91M;\89w<\d8\90\9e\81\c1\e7\ef?\89\cc`A\c1\05S<\f1q\8f+\c2\f3\ef?")
 (export "getMaxCandles" (func $assembly/index/getMaxCandles))
 (export "getMaxVisible" (func $assembly/index/getMaxVisible))
 (export "getMaxGridTicks" (func $assembly/index/getMaxGridTicks))
 (export "getMaxEmas" (func $assembly/index/getMaxEmas))
 (export "getBytesPerCandle" (func $assembly/index/getBytesPerCandle))
 (export "getParamInSize" (func $assembly/index/getParamOutSize))
 (export "getParamOutSize" (func $assembly/index/getParamOutSize))
 (export "getWorkSize" (func $assembly/index/getWorkSize))
 (export "getCandlesSoaSize" (func $assembly/index/getCandlesSoaSize))
 (export "getRenderOutSize" (func $assembly/index/getRenderOutSize))
 (export "getTotalArenaSize" (func $assembly/index/getTotalArenaSize))
 (export "getParamInPtr" (func $assembly/index/getParamInPtr))
 (export "getParamOutPtr" (func $assembly/index/getParamOutPtr))
 (export "getScratchWorkPtr" (func $assembly/index/getScratchWorkPtr))
 (export "getCandlesSoaPtr" (func $assembly/index/getCandlesSoaPtr))
 (export "getRenderOutPtr" (func $assembly/index/getRenderOutPtr))
 (export "getCTsPtr" (func $assembly/index/getCandlesSoaPtr))
 (export "getCOpenPtr" (func $assembly/index/getCOpenPtr))
 (export "getCHighPtr" (func $assembly/index/getCHighPtr))
 (export "getCLowPtr" (func $assembly/index/getCLowPtr))
 (export "getCClosePtr" (func $assembly/index/getCClosePtr))
 (export "getCVolPtr" (func $assembly/index/getCVolPtr))
 (export "getCEma0Ptr" (func $assembly/index/getCEma0Ptr))
 (export "getCEma1Ptr" (func $assembly/index/getCEma1Ptr))
 (export "getCEma2Ptr" (func $assembly/index/getCEma2Ptr))
 (export "getCEma3Ptr" (func $assembly/index/getCEma3Ptr))
 (export "getCBbUpperPtr" (func $assembly/index/getCBbUpperPtr))
 (export "getCBbLowerPtr" (func $assembly/index/getCBbLowerPtr))
 (export "getCRsiPtr" (func $assembly/index/getCRsiPtr))
 (export "getCMetaPtr" (func $assembly/index/getCMetaPtr))
 (export "getRBodyInstPtr" (func $assembly/index/getRenderOutPtr))
 (export "getRWickInstPtr" (func $assembly/index/getRWickInstPtr))
 (export "getRVolInstPtr" (func $assembly/index/getRVolInstPtr))
 (export "getRColorPtr" (func $assembly/index/getRColorPtr))
 (export "getREma0XyPtr" (func $assembly/index/getREma0XyPtr))
 (export "getREma1XyPtr" (func $assembly/index/getREma1XyPtr))
 (export "getREma2XyPtr" (func $assembly/index/getREma2XyPtr))
 (export "getREma3XyPtr" (func $assembly/index/getREma3XyPtr))
 (export "getRBbUpperXyPtr" (func $assembly/index/getRBbUpperXyPtr))
 (export "getRBbLowerXyPtr" (func $assembly/index/getRBbLowerXyPtr))
 (export "getRRsiXyPtr" (func $assembly/index/getRRsiXyPtr))
 (export "getRGridPricesPtr" (func $assembly/index/getRGridPricesPtr))
 (export "getRGridYsPtr" (func $assembly/index/getRGridYsPtr))
 (export "initEngine" (func $assembly/engine/initEngine))
 (export "shiftForPrepend" (func $assembly/engine/shiftForPrepend))
 (export "appendCandle" (func $assembly/engine/appendCandle))
 (export "updateLastCandle" (func $assembly/engine/updateLastCandle))
 (export "computeIndicators" (func $assembly/engine/computeIndicators))
 (export "renderProject" (func $assembly/engine/renderProject))
 (export "secure_wipe" (func $assembly/arena/secure_wipe))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/math/NativeMathf.log (param $0 f32) (result f32)
  (local $1 i32)
  (local $2 f64)
  (local $3 f64)
  (local $4 i32)
  (local $5 i32)
  block $~lib/util/math/logf_lut|inlined.0 (result f32)
   local.get $0
   i32.reinterpret_f32
   local.tee $1
   i32.const 8388608
   i32.sub
   i32.const 2130706432
   i32.ge_u
   if
    f32.const -inf
    local.get $1
    i32.const 1
    i32.shl
    local.tee $4
    i32.eqz
    br_if $~lib/util/math/logf_lut|inlined.0
    drop
    local.get $0
    local.get $1
    i32.const 2139095040
    i32.eq
    br_if $~lib/util/math/logf_lut|inlined.0
    drop
    local.get $1
    i32.const 31
    i32.shr_u
    local.get $4
    i32.const -16777216
    i32.ge_u
    i32.or
    if
     local.get $0
     local.get $0
     f32.sub
     local.tee $0
     local.get $0
     f32.div
     br $~lib/util/math/logf_lut|inlined.0
    end
    local.get $0
    f32.const 8388608
    f32.mul
    i32.reinterpret_f32
    i32.const 192937984
    i32.sub
    local.set $1
   end
   local.get $1
   i32.const 1060306944
   i32.sub
   local.tee $4
   i32.const 19
   i32.shr_u
   i32.const 15
   i32.and
   i32.const 4
   i32.shl
   i32.const 990976
   i32.add
   local.set $5
   local.get $1
   local.get $4
   i32.const -8388608
   i32.and
   i32.sub
   f32.reinterpret_i32
   f64.promote_f32
   local.get $5
   f64.load
   f64.mul
   f64.const -1
   f64.add
   local.tee $2
   local.get $2
   f64.mul
   local.set $3
   local.get $2
   f64.const 0.333456765744066
   f64.mul
   f64.const -0.4999997485802103
   f64.add
   local.get $3
   f64.const -0.25089342214237154
   f64.mul
   f64.add
   local.get $3
   f64.mul
   local.get $5
   f64.load offset=8
   local.get $4
   i32.const 23
   i32.shr_s
   f64.convert_i32_s
   f64.const 0.6931471805599453
   f64.mul
   f64.add
   local.get $2
   f64.add
   f64.add
   f32.demote_f64
  end
 )
 (func $~start
  i32.const 5120
  global.set $assembly/arena/Arena.current
 )
 (func $~lib/math/NativeMath.pow (param $0 f64) (result f64)
  (local $1 i32)
  (local $2 i64)
  (local $3 f64)
  (local $4 f64)
  (local $5 f64)
  (local $6 f64)
  (local $7 f64)
  (local $8 i64)
  (local $9 i64)
  (local $10 f64)
  (local $11 f64)
  (local $12 f64)
  (local $13 f64)
  (local $14 i32)
  local.get $0
  f64.abs
  f64.const 2
  f64.le
  if
   local.get $0
   f64.const 2
   f64.eq
   if
    f64.const 100
    return
   end
   local.get $0
   f64.const 0.5
   f64.eq
   if
    f64.const 3.1622776601683795
    return
   end
   local.get $0
   f64.const -1
   f64.eq
   if
    f64.const 0.1
    return
   end
   local.get $0
   f64.const 1
   f64.eq
   if
    f64.const 10
    return
   end
   local.get $0
   f64.const 0
   f64.eq
   if
    f64.const 1
    return
   end
  end
  block $~lib/util/math/pow_lut|inlined.0 (result f64)
   local.get $0
   i64.reinterpret_f64
   local.tee $2
   i64.const 52
   i64.shr_u
   local.tee $8
   i64.const 2047
   i64.and
   i64.const 958
   i64.sub
   i64.const 128
   i64.ge_u
   if
    local.get $2
    i64.const 1
    i64.shl
    local.tee $9
    i64.const 1
    i64.sub
    i64.const -9007199254740993
    i64.ge_u
    if
     f64.const 1
     local.get $9
     i64.eqz
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     local.get $0
     f64.const 10
     f64.add
     local.get $9
     i64.const -9007199254740992
     i64.gt_u
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const 0
     local.get $2
     i64.const 63
     i64.shr_u
     i32.wrap_i64
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     local.get $0
     local.get $0
     f64.mul
     br $~lib/util/math/pow_lut|inlined.0
    end
    local.get $8
    i64.const 2047
    i64.and
    local.tee $9
    i64.const 958
    i64.sub
    i64.const 128
    i64.ge_u
    if
     f64.const 1
     local.get $9
     i64.const 958
     i64.lt_u
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const inf
     f64.const 0
     local.get $8
     i64.const 2048
     i64.lt_u
     select
     br $~lib/util/math/pow_lut|inlined.0
    end
   end
   i32.const 994928
   f64.load
   f64.const 2.079441541679671
   f64.add
   local.tee $10
   i32.const 994912
   f64.load
   local.tee $3
   f64.const 1.25
   f64.mul
   f64.const -1
   f64.add
   local.tee $7
   local.get $3
   f64.const 0
   f64.mul
   local.tee $11
   f64.add
   local.tee $4
   f64.add
   local.set $5
   local.get $4
   local.get $4
   f64.const -0.5
   f64.mul
   local.tee $12
   f64.mul
   local.set $6
   local.get $5
   local.get $7
   local.get $7
   f64.const -0.5
   f64.mul
   local.tee $13
   f64.mul
   local.tee $3
   f64.add
   local.tee $7
   local.get $7
   i32.const 994936
   f64.load
   f64.const 1.6493769056125113e-13
   f64.add
   local.get $10
   local.get $5
   f64.sub
   local.get $4
   f64.add
   f64.add
   local.get $11
   local.get $12
   local.get $13
   f64.add
   f64.mul
   f64.add
   local.get $5
   local.get $7
   f64.sub
   local.get $3
   f64.add
   f64.add
   local.get $4
   local.get $6
   f64.mul
   local.get $4
   f64.const 0.5000000000000007
   f64.mul
   f64.const -0.6666666666666679
   f64.add
   local.get $6
   local.get $4
   f64.const -0.6666666663487739
   f64.mul
   f64.const 0.7999999995323976
   f64.add
   local.get $6
   local.get $4
   f64.const 1.0000415263675542
   f64.mul
   f64.const -1.142909628459501
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   local.tee $3
   f64.add
   local.tee $4
   f64.sub
   local.get $3
   f64.add
   global.set $~lib/util/math/log_tail
   local.get $2
   i64.const -134217728
   i64.and
   f64.reinterpret_i64
   local.tee $3
   local.get $4
   i64.reinterpret_f64
   i64.const -134217728
   i64.and
   f64.reinterpret_i64
   local.tee $5
   f64.mul
   local.set $6
   local.get $0
   local.get $3
   f64.sub
   local.get $5
   f64.mul
   local.get $0
   local.get $4
   local.get $5
   f64.sub
   global.get $~lib/util/math/log_tail
   f64.add
   f64.mul
   f64.add
   local.set $0
   block $~lib/util/math/exp_inline|inlined.0 (result f64)
    local.get $6
    i64.reinterpret_f64
    local.tee $2
    i64.const 52
    i64.shr_u
    i32.wrap_i64
    i32.const 2047
    i32.and
    local.tee $1
    i32.const 969
    i32.sub
    local.tee $14
    i32.const 63
    i32.ge_u
    if
     f64.const 1
     local.get $14
     i32.const -2147483648
     i32.ge_u
     br_if $~lib/util/math/exp_inline|inlined.0
     drop
     f64.const 0
     f64.const inf
     local.get $2
     i64.const 0
     i64.lt_s
     select
     local.get $1
     i32.const 1033
     i32.ge_u
     br_if $~lib/util/math/exp_inline|inlined.0
     drop
     i32.const 0
     local.set $1
    end
    local.get $6
    f64.const 184.6649652337873
    f64.mul
    f64.const 6755399441055744
    f64.add
    local.tee $3
    i64.reinterpret_f64
    local.tee $2
    i64.const 127
    i64.and
    i64.const 1
    i64.shl
    i32.wrap_i64
    i32.const 3
    i32.shl
    i32.const 995584
    i32.add
    local.tee $14
    i64.load offset=8
    local.get $2
    i64.const 45
    i64.shl
    i64.add
    local.set $8
    local.get $6
    local.get $3
    f64.const -6755399441055744
    f64.add
    local.tee $3
    f64.const -0.005415212348111709
    f64.mul
    f64.add
    local.get $3
    f64.const -1.2864023111638346e-14
    f64.mul
    f64.add
    local.get $0
    f64.add
    local.tee $0
    local.get $0
    f64.mul
    local.set $3
    local.get $14
    f64.load
    local.get $0
    f64.add
    local.get $3
    local.get $0
    f64.const 0.16666666666665886
    f64.mul
    f64.const 0.49999999999996786
    f64.add
    f64.mul
    f64.add
    local.get $3
    local.get $3
    f64.mul
    local.get $0
    f64.const 0.008333335853059549
    f64.mul
    f64.const 0.0416666808410674
    f64.add
    f64.mul
    f64.add
    local.set $0
    local.get $1
    i32.eqz
    if
     block $~lib/util/math/specialcase|inlined.0 (result f64)
      local.get $2
      i64.const 2147483648
      i64.and
      i64.eqz
      if
       local.get $8
       i64.const 4544132024016830464
       i64.sub
       f64.reinterpret_i64
       local.tee $3
       local.get $3
       local.get $0
       f64.mul
       f64.add
       f64.const 5486124068793688683255936e279
       f64.mul
       br $~lib/util/math/specialcase|inlined.0
      end
      local.get $8
      i64.const 4602678819172646912
      i64.add
      local.tee $2
      f64.reinterpret_i64
      local.tee $3
      local.get $0
      f64.mul
      local.set $0
      local.get $3
      local.get $0
      f64.add
      local.tee $4
      f64.abs
      f64.const 1
      f64.lt
      if (result f64)
       local.get $2
       i64.const -9223372036854775808
       i64.and
       f64.reinterpret_i64
       f64.const 1
       local.get $4
       f64.copysign
       local.tee $5
       local.get $4
       f64.add
       local.tee $6
       local.get $5
       local.get $6
       f64.sub
       local.get $4
       f64.add
       local.get $3
       local.get $4
       f64.sub
       local.get $0
       f64.add
       f64.add
       f64.add
       local.get $5
       f64.sub
       local.tee $0
       local.get $0
       f64.const 0
       f64.eq
       select
      else
       local.get $4
      end
      f64.const 2.2250738585072014e-308
      f64.mul
     end
     br $~lib/util/math/exp_inline|inlined.0
    end
    local.get $8
    f64.reinterpret_i64
    local.tee $3
    local.get $3
    local.get $0
    f64.mul
    f64.add
   end
  end
 )
 (func $assembly/index/getWorkSize (result i32)
  i32.const 16384
 )
 (func $assembly/index/getTotalArenaSize (result i32)
  i32.const 989952
 )
 (func $assembly/index/getScratchWorkPtr (result i32)
  i32.const 5120
 )
 (func $assembly/index/getRenderOutSize (result i32)
  i32.const 269056
 )
 (func $assembly/index/getRenderOutPtr (result i32)
  i32.const 721920
 )
 (func $assembly/index/getRWickInstPtr (result i32)
  i32.const 762880
 )
 (func $assembly/index/getRVolInstPtr (result i32)
  i32.const 803840
 )
 (func $assembly/index/getRRsiXyPtr (result i32)
  i32.const 970240
 )
 (func $assembly/index/getRGridYsPtr (result i32)
  i32.const 990848
 )
 (func $assembly/index/getRGridPricesPtr (result i32)
  i32.const 990720
 )
 (func $assembly/index/getREma3XyPtr (result i32)
  i32.const 908800
 )
 (func $assembly/index/getREma2XyPtr (result i32)
  i32.const 888320
 )
 (func $assembly/index/getREma1XyPtr (result i32)
  i32.const 867840
 )
 (func $assembly/index/getREma0XyPtr (result i32)
  i32.const 847360
 )
 (func $assembly/index/getRColorPtr (result i32)
  i32.const 844800
 )
 (func $assembly/index/getRBbUpperXyPtr (result i32)
  i32.const 929280
 )
 (func $assembly/index/getRBbLowerXyPtr (result i32)
  i32.const 949760
 )
 (func $assembly/index/getParamOutSize (result i32)
  i32.const 2048
 )
 (func $assembly/index/getParamOutPtr (result i32)
  i32.const 3072
 )
 (func $assembly/index/getParamInPtr (result i32)
  i32.const 1024
 )
 (func $assembly/index/getMaxVisible (result i32)
  i32.const 2560
 )
 (func $assembly/index/getMaxGridTicks (result i32)
  i32.const 32
 )
 (func $assembly/index/getMaxEmas (result i32)
  i32.const 4
 )
 (func $assembly/index/getMaxCandles (result i32)
  i32.const 12288
 )
 (func $assembly/index/getCandlesSoaSize (result i32)
  i32.const 700416
 )
 (func $assembly/index/getCandlesSoaPtr (result i32)
  i32.const 21504
 )
 (func $assembly/index/getCVolPtr (result i32)
  i32.const 316416
 )
 (func $assembly/index/getCRsiPtr (result i32)
  i32.const 660480
 )
 (func $assembly/index/getCOpenPtr (result i32)
  i32.const 119808
 )
 (func $assembly/index/getCMetaPtr (result i32)
  i32.const 709632
 )
 (func $assembly/index/getCLowPtr (result i32)
  i32.const 218112
 )
 (func $assembly/index/getCHighPtr (result i32)
  i32.const 168960
 )
 (func $assembly/index/getCEma3Ptr (result i32)
  i32.const 513024
 )
 (func $assembly/index/getCEma2Ptr (result i32)
  i32.const 463872
 )
 (func $assembly/index/getCEma1Ptr (result i32)
  i32.const 414720
 )
 (func $assembly/index/getCEma0Ptr (result i32)
  i32.const 365568
 )
 (func $assembly/index/getCClosePtr (result i32)
  i32.const 267264
 )
 (func $assembly/index/getCBbUpperPtr (result i32)
  i32.const 562176
 )
 (func $assembly/index/getCBbLowerPtr (result i32)
  i32.const 611328
 )
 (func $assembly/index/getBytesPerCandle (result i32)
  i32.const 57
 )
 (func $assembly/engine/updateLastCandle (param $0 f32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f64)
  (local $5 i32)
  (local $6 i32)
  (local $7 f64)
  (local $8 i32)
  (local $9 f32)
  (local $10 i32)
  (local $11 f32)
  (local $12 f32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 f64)
  i32.const 1024
  i32.load
  local.tee $5
  i32.const 0
  i32.le_s
  if
   return
  end
  local.get $5
  i32.const 1
  i32.sub
  local.tee $8
  i32.const 2
  i32.shl
  local.tee $6
  i32.const 168960
  i32.add
  local.tee $5
  f32.load
  local.set $9
  local.get $6
  i32.const 218112
  i32.add
  local.tee $10
  f32.load
  local.set $11
  local.get $8
  i32.const 3
  i32.shl
  i32.const 21504
  i32.add
  local.get $4
  f64.store
  local.get $5
  local.get $0
  local.get $9
  local.get $0
  local.get $9
  f32.gt
  select
  f32.store
  local.get $10
  local.get $1
  local.get $11
  local.get $1
  local.get $11
  f32.lt
  select
  f32.store
  local.get $6
  i32.const 267264
  i32.add
  local.get $2
  f32.store
  local.get $6
  i32.const 316416
  i32.add
  local.get $3
  f32.store
  local.get $6
  i32.const 267264
  i32.add
  f32.load
  local.tee $1
  local.get $6
  i32.const 119808
  i32.add
  f32.load
  local.tee $3
  f32.sub
  f32.abs
  local.set $9
  local.get $1
  local.get $3
  f32.ge
  local.set $5
  local.get $6
  i32.const 168960
  i32.add
  f32.load
  local.tee $11
  local.get $6
  i32.const 218112
  i32.add
  f32.load
  local.tee $12
  f32.sub
  local.tee $0
  f32.const 9.999999717180685e-10
  f32.gt
  if
   local.get $5
   i32.const 2
   i32.or
   local.get $5
   local.get $9
   local.get $0
   f32.const 0.11999999731779099
   f32.mul
   f32.le
   select
   local.set $6
   local.get $11
   local.get $1
   local.get $3
   local.get $5
   select
   f32.sub
   local.set $0
   local.get $3
   local.get $1
   local.get $5
   select
   local.get $12
   f32.sub
   local.set $11
   local.get $9
   f32.const 0
   f32.gt
   if (result i32)
    local.get $0
    local.get $9
    f32.const 0.6000000238418579
    f32.mul
    f32.le
    local.get $11
    local.get $9
    local.get $9
    f32.add
    f32.ge
    i32.and
    if (result i32)
     local.get $6
     i32.const 4
     i32.or
    else
     local.get $6
     i32.const 4
     i32.or
     local.get $6
     local.get $11
     local.get $9
     f32.const 0.6000000238418579
     f32.mul
     f32.le
     local.get $0
     local.get $9
     local.get $9
     f32.add
     f32.ge
     i32.and
     select
    end
   else
    local.get $6
   end
   local.set $5
  end
  local.get $8
  i32.const 709632
  i32.add
  local.get $8
  i32.const 0
  i32.gt_s
  if (result i32)
   local.get $8
   i32.const 1
   i32.sub
   i32.const 2
   i32.shl
   local.tee $6
   i32.const 119808
   i32.add
   f32.load
   local.tee $0
   local.get $6
   i32.const 267264
   i32.add
   f32.load
   local.tee $11
   f32.le
   local.get $1
   local.get $3
   f32.ge
   i32.ne
   if (result i32)
    local.get $9
    local.get $11
    local.get $0
    f32.sub
    f32.abs
    f32.const 1.0499999523162842
    f32.mul
    f32.gt
    if (result i32)
     local.get $5
     i32.const 8
     i32.or
     local.get $5
     local.get $1
     local.get $3
     local.get $1
     local.get $3
     f32.lt
     select
     local.get $11
     local.get $0
     local.get $0
     local.get $11
     f32.gt
     select
     f32.le
     local.get $1
     local.get $3
     local.get $1
     local.get $3
     f32.gt
     select
     local.get $11
     local.get $0
     local.get $0
     local.get $11
     f32.lt
     select
     f32.ge
     i32.and
     select
    else
     local.get $5
    end
   else
    local.get $5
   end
  else
   local.get $5
  end
  i32.store8
  local.get $8
  i32.const 2
  i32.shl
  local.set $10
  i32.const 9
  i32.const 500
  i32.const 1080
  i32.load
  local.tee $5
  local.get $5
  i32.const 500
  i32.gt_s
  select
  local.get $5
  i32.const 2
  i32.lt_s
  select
  local.set $13
  i32.const 21
  i32.const 500
  i32.const 1084
  i32.load
  local.tee $5
  local.get $5
  i32.const 500
  i32.gt_s
  select
  local.get $5
  i32.const 2
  i32.lt_s
  select
  local.set $14
  i32.const 50
  i32.const 500
  i32.const 1124
  i32.load
  local.tee $5
  local.get $5
  i32.const 500
  i32.gt_s
  select
  local.get $5
  i32.const 2
  i32.lt_s
  select
  local.set $6
  i32.const 200
  i32.const 500
  i32.const 1128
  i32.load
  local.tee $5
  local.get $5
  i32.const 500
  i32.gt_s
  select
  local.get $5
  i32.const 2
  i32.lt_s
  select
  local.set $5
  block $assembly/engine/update4EmasAt|inlined.1
   local.get $8
   i32.eqz
   if
    i32.const 365568
    local.get $2
    f32.store
    i32.const 414720
    local.get $2
    f32.store
    i32.const 463872
    local.get $2
    f32.store
    i32.const 513024
    local.get $2
    f32.store
    br $assembly/engine/update4EmasAt|inlined.1
   end
   local.get $8
   i32.const 1
   i32.sub
   i32.const 2
   i32.shl
   local.tee $15
   i32.const 414720
   i32.add
   f32.load
   local.set $0
   local.get $15
   i32.const 463872
   i32.add
   f32.load
   local.set $1
   local.get $15
   i32.const 513024
   i32.add
   f32.load
   local.set $3
   local.get $10
   i32.const 365568
   i32.add
   local.get $2
   f32.const 2
   local.get $13
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $9
   f32.mul
   local.get $15
   i32.const 365568
   i32.add
   f32.load
   f32.const 1
   local.get $9
   f32.sub
   f32.mul
   f32.add
   f32.store
   local.get $10
   i32.const 414720
   i32.add
   local.get $2
   f32.const 2
   local.get $14
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $9
   f32.mul
   local.get $0
   f32.const 1
   local.get $9
   f32.sub
   f32.mul
   f32.add
   f32.store
   local.get $10
   i32.const 463872
   i32.add
   local.get $2
   f32.const 2
   local.get $6
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $0
   f32.mul
   local.get $1
   f32.const 1
   local.get $0
   f32.sub
   f32.mul
   f32.add
   f32.store
   local.get $10
   i32.const 513024
   i32.add
   local.get $2
   f32.const 2
   local.get $5
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $0
   f32.mul
   local.get $3
   f32.const 1
   local.get $0
   f32.sub
   f32.mul
   f32.add
   f32.store
  end
  i32.const 1120
  f32.load
  local.tee $0
  f32.const 2
  local.get $0
  f32.const 0.10000000149011612
  f32.gt
  select
  local.set $0
  local.get $8
  i32.const 2
  i32.shl
  local.tee $6
  i32.const 267264
  i32.add
  f32.load
  local.set $1
  local.get $8
  local.get $8
  i32.const 20
  i32.const 1116
  i32.load
  local.tee $5
  local.get $5
  i32.const 2
  i32.le_s
  select
  i32.sub
  i32.const 1
  i32.add
  local.tee $5
  i32.const 0
  local.get $5
  i32.const 0
  i32.gt_s
  select
  local.tee $5
  i32.sub
  i32.const 1
  i32.add
  local.set $10
  f64.const 0
  local.set $4
  loop $for-loop|0
   local.get $5
   local.get $8
   i32.le_s
   if
    local.get $4
    local.get $5
    i32.const 2
    i32.shl
    i32.const 267264
    i32.add
    f32.load
    f64.promote_f32
    local.tee $16
    f64.add
    local.set $4
    local.get $7
    local.get $16
    local.get $16
    f64.mul
    f64.add
    local.set $7
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $for-loop|0
   end
  end
  local.get $6
  i32.const 562176
  i32.add
  local.get $4
  local.get $10
  f64.convert_i32_s
  local.tee $4
  f64.div
  local.tee $16
  local.get $7
  local.get $4
  f64.div
  local.get $16
  local.get $16
  f64.mul
  f64.sub
  f64.const 0
  f64.max
  f64.sqrt
  local.get $0
  f64.promote_f32
  f64.mul
  local.tee $4
  f64.add
  f32.demote_f64
  f32.store
  local.get $6
  i32.const 611328
  i32.add
  local.get $16
  local.get $4
  f64.sub
  f32.demote_f64
  f32.store
  local.get $8
  if
   global.get $assembly/engine/rsiStateIdx
   local.get $8
   i32.eq
   local.get $8
   i32.const 14
   i32.gt_s
   i32.and
   if
    global.get $assembly/engine/rsiBaseGain
    f64.const 13
    f64.mul
    local.get $1
    local.get $8
    i32.const 2
    i32.shl
    i32.const 267260
    i32.add
    f32.load
    f32.sub
    f64.promote_f32
    local.tee $4
    f64.const 0
    local.get $4
    f64.const 0
    f64.gt
    select
    f64.add
    f64.const 14
    f64.div
    global.set $assembly/engine/rsiCurGain
    global.get $assembly/engine/rsiBaseLoss
    f64.const 13
    f64.mul
    local.get $4
    f64.neg
    f64.const 0
    local.get $4
    f64.const 0
    f64.lt
    select
    f64.add
    f64.const 14
    f64.div
    global.set $assembly/engine/rsiCurLoss
    local.get $6
    i32.const 660480
    i32.add
    block $assembly/engine/rsiFromAvg|inlined.2 (result f32)
     f32.const 100
     f32.const 50
     global.get $assembly/engine/rsiCurGain
     local.tee $4
     f64.const 1e-09
     f64.gt
     select
     global.get $assembly/engine/rsiCurLoss
     local.tee $7
     f64.const 1e-09
     f64.lt
     br_if $assembly/engine/rsiFromAvg|inlined.2
     drop
     f64.const 100
     f64.const 100
     local.get $4
     local.get $7
     f64.div
     f64.const 1
     f64.add
     f64.div
     f64.sub
     f32.demote_f64
    end
    f32.store
   else
    f64.const 0
    local.set $4
    f64.const 0
    local.set $7
    local.get $8
    i32.const 14
    local.get $8
    local.get $8
    i32.const 14
    i32.ge_s
    select
    local.tee $10
    i32.sub
    i32.const 1
    i32.add
    local.set $5
    loop $for-loop|1
     local.get $5
     local.get $8
     i32.le_s
     if
      local.get $5
      i32.const 2
      i32.shl
      local.tee $13
      i32.const 267264
      i32.add
      f32.load
      local.get $13
      i32.const 267260
      i32.add
      f32.load
      f32.sub
      f64.promote_f32
      local.tee $16
      f64.const 0
      f64.gt
      if
       local.get $4
       local.get $16
       f64.add
       local.set $4
      else
       local.get $7
       local.get $16
       f64.sub
       local.set $7
      end
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $for-loop|1
     end
    end
    local.get $4
    local.get $10
    f64.convert_i32_s
    local.tee $4
    f64.div
    local.tee $16
    global.set $assembly/engine/rsiCurGain
    local.get $7
    local.get $4
    f64.div
    local.tee $4
    global.set $assembly/engine/rsiCurLoss
    local.get $8
    global.set $assembly/engine/rsiStateIdx
    local.get $6
    i32.const 660480
    i32.add
    local.get $4
    f64.const 1e-09
    f64.lt
    if (result f32)
     f32.const 100
     f32.const 50
     local.get $16
     f64.const 1e-09
     f64.gt
     select
    else
     f64.const 100
     f64.const 100
     local.get $16
     local.get $4
     f64.div
     f64.const 1
     f64.add
     f64.div
     f64.sub
     f32.demote_f64
    end
    f32.store
   end
  else
   i32.const 660480
   f32.const 50
   f32.store
   f64.const 0
   global.set $assembly/engine/rsiBaseGain
   f64.const 0
   global.set $assembly/engine/rsiBaseLoss
   f64.const 0
   global.set $assembly/engine/rsiCurGain
   f64.const 0
   global.set $assembly/engine/rsiCurLoss
   i32.const 0
   global.set $assembly/engine/rsiStateIdx
  end
 )
 (func $assembly/engine/shiftForPrepend (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.const 0
  i32.le_s
  if
   i32.const 0
   return
  end
  i32.const 12288
  i32.const 12288
  local.get $0
  local.get $0
  i32.const 12288
  i32.gt_s
  select
  local.tee $0
  i32.sub
  local.tee $1
  i32.const 1024
  i32.load
  local.tee $2
  local.get $1
  local.get $2
  i32.lt_s
  select
  local.set $2
  local.get $0
  i32.const 0
  i32.gt_s
  local.get $2
  i32.const 0
  i32.gt_s
  i32.and
  if
   local.get $0
   i32.const 3
   i32.shl
   i32.const 21504
   i32.add
   i32.const 21504
   local.get $2
   i32.const 3
   i32.shl
   memory.copy
   local.get $0
   i32.const 2
   i32.shl
   local.tee $3
   i32.const 119808
   i32.add
   i32.const 119808
   local.get $2
   i32.const 2
   i32.shl
   local.tee $1
   memory.copy
   local.get $3
   i32.const 168960
   i32.add
   i32.const 168960
   local.get $1
   memory.copy
   local.get $3
   i32.const 218112
   i32.add
   i32.const 218112
   local.get $1
   memory.copy
   local.get $3
   i32.const 267264
   i32.add
   i32.const 267264
   local.get $1
   memory.copy
   local.get $3
   i32.const 316416
   i32.add
   i32.const 316416
   local.get $1
   memory.copy
  end
  i32.const 1024
  local.get $0
  local.get $2
  i32.add
  i32.store
  i32.const -1
  global.set $assembly/engine/rsiStateIdx
  local.get $0
 )
 (func $assembly/engine/scanVisibleMinMaxSIMD (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  (local $5 f32)
  (local $6 v128)
  (local $7 f32)
  (local $8 f32)
  (local $9 v128)
  (local $10 f32)
  (local $11 f32)
  (local $12 v128)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 f32)
  (local $18 f32)
  (local $19 v128)
  f32.const 3402823466385288598117041e14
  local.set $7
  f32.const -3402823466385288598117041e14
  local.set $10
  local.get $3
  i32.const 1
  i32.and
  local.set $13
  local.get $3
  i32.const 2
  i32.and
  i32.const 0
  i32.ne
  local.set $14
  local.get $3
  i32.const 4
  i32.and
  i32.const 0
  i32.ne
  local.set $15
  local.get $3
  i32.const 8
  i32.and
  i32.const 0
  i32.ne
  local.set $3
  loop $while-continue|0
   local.get $0
   i32.const 3
   i32.and
   i32.const 0
   i32.ne
   local.get $0
   local.get $1
   i32.lt_s
   i32.and
   if
    local.get $0
    i32.const 2
    i32.shl
    local.tee $16
    i32.const 218112
    i32.add
    f32.load
    local.set $5
    local.get $16
    i32.const 168960
    i32.add
    f32.load
    local.set $8
    local.get $16
    i32.const 316416
    i32.add
    f32.load
    local.set $17
    local.get $2
    if
     local.get $16
     i32.const 562176
     i32.add
     f32.load
     local.tee $18
     local.get $8
     local.get $8
     local.get $18
     f32.lt
     select
     local.set $8
     local.get $16
     i32.const 611328
     i32.add
     f32.load
     local.tee $18
     local.get $5
     f32.lt
     local.get $18
     f32.const 0
     f32.gt
     i32.and
     if
      local.get $18
      local.set $5
     end
    end
    local.get $13
    if
     local.get $16
     i32.const 365568
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $14
    if
     local.get $16
     i32.const 414720
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $15
    if
     local.get $16
     i32.const 463872
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $3
    if
     local.get $16
     i32.const 513024
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $5
    local.get $7
    local.get $5
    local.get $7
    f32.lt
    select
    local.set $7
    local.get $8
    local.get $10
    local.get $8
    local.get $10
    f32.gt
    select
    local.set $10
    local.get $17
    local.get $11
    local.get $11
    local.get $17
    f32.lt
    select
    local.set $11
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $while-continue|0
   end
  end
  local.get $0
  i32.const 4
  i32.add
  local.get $1
  i32.le_s
  if
   local.get $7
   f32x4.splat
   local.set $9
   local.get $10
   f32x4.splat
   local.set $6
   local.get $11
   f32x4.splat
   local.set $12
   loop $for-loop|1
    local.get $0
    i32.const 4
    i32.add
    local.get $1
    i32.le_s
    if
     local.get $9
     local.get $0
     i32.const 2
     i32.shl
     local.tee $16
     i32.const 218112
     i32.add
     v128.load
     f32x4.min
     local.set $9
     local.get $6
     local.get $16
     i32.const 168960
     i32.add
     v128.load
     f32x4.max
     local.set $6
     local.get $12
     local.get $16
     i32.const 316416
     i32.add
     v128.load
     f32x4.max
     local.set $12
     local.get $2
     if
      local.get $9
      local.get $16
      i32.const 611328
      i32.add
      v128.load
      f32x4.min
      local.set $9
      local.get $6
      local.get $16
      i32.const 562176
      i32.add
      v128.load
      f32x4.max
      local.set $6
     end
     local.get $13
     if
      local.get $9
      local.get $16
      i32.const 365568
      i32.add
      v128.load
      local.tee $19
      f32x4.min
      local.set $9
      local.get $6
      local.get $19
      f32x4.max
      local.set $6
     end
     local.get $14
     if
      local.get $9
      local.get $16
      i32.const 414720
      i32.add
      v128.load
      local.tee $19
      f32x4.min
      local.set $9
      local.get $6
      local.get $19
      f32x4.max
      local.set $6
     end
     local.get $15
     if
      local.get $9
      local.get $16
      i32.const 463872
      i32.add
      v128.load
      local.tee $19
      f32x4.min
      local.set $9
      local.get $6
      local.get $19
      f32x4.max
      local.set $6
     end
     local.get $3
     if
      local.get $9
      local.get $16
      i32.const 513024
      i32.add
      v128.load
      local.tee $19
      f32x4.min
      local.set $9
      local.get $6
      local.get $19
      f32x4.max
      local.set $6
     end
     local.get $0
     i32.const 4
     i32.add
     local.set $0
     br $for-loop|1
    end
   end
   local.get $6
   f32x4.extract_lane 0
   local.get $6
   f32x4.extract_lane 1
   f32.max
   local.get $6
   f32x4.extract_lane 2
   local.get $6
   f32x4.extract_lane 3
   f32.max
   f32.max
   local.set $10
   local.get $12
   f32x4.extract_lane 0
   local.get $12
   f32x4.extract_lane 1
   f32.max
   local.get $12
   f32x4.extract_lane 2
   local.get $12
   f32x4.extract_lane 3
   f32.max
   f32.max
   local.set $11
   local.get $9
   f32x4.extract_lane 0
   local.get $9
   f32x4.extract_lane 1
   f32.min
   local.get $9
   f32x4.extract_lane 2
   local.get $9
   f32x4.extract_lane 3
   f32.min
   f32.min
   local.set $7
  end
  loop $while-continue|2
   local.get $0
   local.get $1
   i32.lt_s
   if
    local.get $0
    i32.const 2
    i32.shl
    local.tee $16
    i32.const 218112
    i32.add
    f32.load
    local.set $5
    local.get $16
    i32.const 168960
    i32.add
    f32.load
    local.set $8
    local.get $16
    i32.const 316416
    i32.add
    f32.load
    local.set $17
    local.get $2
    if
     local.get $16
     i32.const 562176
     i32.add
     f32.load
     local.tee $18
     local.get $8
     local.get $8
     local.get $18
     f32.lt
     select
     local.set $8
     local.get $16
     i32.const 611328
     i32.add
     f32.load
     local.tee $18
     local.get $5
     f32.lt
     local.get $18
     f32.const 0
     f32.gt
     i32.and
     if
      local.get $18
      local.set $5
     end
    end
    local.get $13
    if
     local.get $16
     i32.const 365568
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $14
    if
     local.get $16
     i32.const 414720
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $15
    if
     local.get $16
     i32.const 463872
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $3
    if
     local.get $16
     i32.const 513024
     i32.add
     f32.load
     local.tee $18
     f32.const 0
     f32.gt
     if
      local.get $18
      local.get $8
      local.get $8
      local.get $18
      f32.lt
      select
      local.set $8
      local.get $18
      local.get $5
      local.get $5
      local.get $18
      f32.gt
      select
      local.set $5
     end
    end
    local.get $5
    local.get $7
    local.get $5
    local.get $7
    f32.lt
    select
    local.set $7
    local.get $8
    local.get $10
    local.get $8
    local.get $10
    f32.gt
    select
    local.set $10
    local.get $17
    local.get $11
    local.get $11
    local.get $17
    f32.lt
    select
    local.set $11
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $while-continue|2
   end
  end
  local.get $4
  local.get $7
  f32.store
  local.get $4
  local.get $10
  f32.store offset=4
  local.get $4
  local.get $11
  f32.store offset=8
 )
 (func $assembly/engine/renderProject (result i32)
  (local $0 i32)
  (local $1 f32)
  (local $2 i32)
  (local $3 f32)
  (local $4 f32)
  (local $5 i32)
  (local $6 f32)
  (local $7 f32)
  (local $8 f32)
  (local $9 f32)
  (local $10 f32)
  (local $11 i32)
  (local $12 f32)
  (local $13 f64)
  (local $14 i32)
  (local $15 v128)
  (local $16 f32)
  (local $17 f32)
  (local $18 f32)
  (local $19 f32)
  (local $20 f32)
  (local $21 f32)
  (local $22 i32)
  (local $23 f32)
  (local $24 f32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 f32)
  (local $29 i32)
  (local $30 f32)
  (local $31 f32)
  (local $32 f32)
  (local $33 f32)
  (local $34 f32)
  (local $35 f32)
  (local $36 f32)
  (local $37 i32)
  (local $38 f32)
  (local $39 i32)
  (local $40 f32)
  (local $41 f32)
  (local $42 f32)
  (local $43 i32)
  (local $44 i32)
  (local $45 i32)
  (local $46 i32)
  (local $47 i32)
  (local $48 i32)
  (local $49 v128)
  (local $50 v128)
  (local $51 v128)
  (local $52 i32)
  (local $53 i32)
  (local $54 i64)
  (local $55 f32)
  (local $56 f32)
  (local $57 f32)
  (local $58 f32)
  (local $59 f32)
  (local $60 f32)
  (local $61 f32)
  (local $62 i32)
  (local $63 f64)
  (local $64 f32)
  (local $65 f32)
  (local $66 f32)
  (local $67 f32)
  global.get $assembly/arena/Arena.current
  local.set $39
  block $folding-inner0
   i32.const 1024
   i32.load
   local.tee $26
   i32.const 0
   i32.le_s
   if
    i32.const 3072
    i32.const 0
    i32.store
    i32.const 3076
    i32.const 0
    i32.store
    br $folding-inner0
   end
   i32.const 1036
   f32.load
   local.set $30
   i32.const 1040
   f32.load
   local.set $31
   i32.const 1044
   f32.load
   local.set $40
   i32.const 1048
   f32.load
   local.set $17
   i32.const 1052
   f32.load
   local.set $41
   i32.const 1056
   f32.load
   local.set $32
   i32.const 1108
   f32.load
   local.set $42
   i32.const 1112
   f32.load
   local.set $28
   i32.const 1060
   f32.load
   f32.const 2
   f32.max
   local.set $23
   i32.const 1064
   f32.load
   f32.const 1
   f32.max
   local.set $33
   i32.const 1068
   f32.load
   local.set $4
   i32.const 1072
   f32.load
   local.set $36
   i32.const 1076
   f32.load
   local.set $34
   i32.const 1100
   f32.load
   f32.const 0.3499999940395355
   f32.min
   f32.const 0.009999999776482582
   f32.max
   local.set $9
   i32.const 1104
   f32.load
   f32.const 1
   f32.max
   local.set $16
   i32.const 1088
   i32.load
   local.tee $14
   i32.const 1
   i32.and
   local.get $14
   i32.const 2
   i32.and
   if (result i32)
    i32.const 1132
    i32.load
    i32.const 15
    i32.and
   else
    i32.const 0
   end
   local.tee $29
   i32.const 1
   i32.and
   local.set $45
   local.get $26
   i32.const 1
   i32.sub
   f32.convert_i32_s
   local.tee $3
   local.get $30
   local.get $40
   f32.add
   local.tee $1
   local.get $23
   f32.const 0.5
   f32.mul
   f32.sub
   local.get $4
   local.get $23
   f32.mul
   f32.add
   local.tee $35
   local.get $30
   local.get $23
   f32.sub
   f32.sub
   local.get $23
   f32.div
   f32.sub
   f32.floor
   i32.trunc_sat_f32_s
   local.tee $0
   i32.const 0
   local.get $0
   i32.const 0
   i32.ge_s
   select
   local.tee $2
   local.get $26
   local.get $3
   local.get $35
   local.get $1
   local.get $23
   f32.add
   f32.sub
   local.get $23
   f32.div
   f32.sub
   f32.ceil
   i32.trunc_sat_f32_s
   i32.const 1
   i32.add
   local.tee $0
   local.get $0
   local.get $26
   i32.gt_s
   select
   local.tee $25
   i32.ge_s
   if
    i32.const 3072
    local.get $2
    i32.store
    i32.const 3076
    local.get $2
    i32.store
    br $folding-inner0
   end
   global.get $assembly/arena/Arena.current
   i32.const 15
   i32.add
   i32.const -16
   i32.and
   local.tee $5
   i32.const 16
   i32.add
   local.tee $0
   i32.const 21504
   i32.gt_u
   if
    unreachable
   end
   local.get $0
   global.set $assembly/arena/Arena.current
   local.get $25
   i32.const 2560
   i32.sub
   local.get $2
   local.get $25
   local.get $2
   i32.sub
   i32.const 2560
   i32.gt_s
   select
   local.tee $2
   local.get $25
   local.get $14
   i32.const 16
   i32.and
   i32.const 0
   i32.ne
   local.tee $43
   local.get $29
   local.get $5
   call $assembly/engine/scanVisibleMinMaxSIMD
   local.get $5
   f32.load
   local.set $4
   local.get $5
   f32.load offset=4
   local.set $3
   local.get $5
   f32.load offset=8
   local.tee $8
   f32.const 9.999999974752427e-07
   f32.lt
   if
    f32.const 1
    local.set $8
   end
   local.get $14
   i32.const 8
   i32.and
   i32.const 0
   i32.ne
   local.tee $37
   if
    local.get $2
    i32.const 2
    i32.shl
    local.tee $0
    i32.const 119808
    i32.add
    f32.load
    local.get $0
    i32.const 267264
    i32.add
    f32.load
    f32.add
    f32.const 0.5
    f32.mul
    local.set $20
    local.get $2
    local.set $0
    loop $for-loop|0
     local.get $0
     local.get $25
     i32.lt_s
     if
      local.get $0
      i32.const 2
      i32.shl
      local.tee $5
      i32.const 168960
      i32.add
      f32.load
      local.tee $1
      local.get $5
      i32.const 119808
      i32.add
      f32.load
      local.get $1
      f32.add
      local.get $5
      i32.const 218112
      i32.add
      f32.load
      local.tee $1
      f32.add
      local.get $5
      i32.const 267264
      i32.add
      f32.load
      f32.add
      f32.const 0.25
      f32.mul
      local.tee $7
      local.get $20
      f32.max
      f32.max
      local.set $6
      local.get $7
      local.get $20
      f32.min
      local.get $1
      f32.min
      local.tee $1
      local.get $4
      f32.lt
      if
       local.get $1
       local.set $4
      end
      local.get $6
      local.get $3
      local.get $3
      local.get $6
      f32.lt
      select
      local.set $3
      local.get $20
      local.get $7
      f32.add
      f32.const 0.5
      f32.mul
      local.set $20
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|0
     end
    end
   end
   local.get $14
   i32.const 4
   i32.and
   i32.const 0
   i32.ne
   local.set $22
   local.get $3
   local.set $7
   if (result f32)
    local.get $4
    local.get $3
    local.get $4
    f32.sub
    local.tee $1
    f32.const 9.999999717180685e-10
    f32.gt
    if (result f32)
     local.get $1
     local.get $9
     f32.mul
    else
     local.get $7
     f32.const 0.009999999776482582
     f32.mul
     f32.const 1
     f32.max
    end
    local.tee $3
    f32.sub
    local.set $1
    local.get $7
    local.get $3
    f32.add
    local.set $20
    local.get $1
    f32.const 0
    f32.le
    local.get $22
    i32.and
    if (result f32)
     local.get $4
     f32.const 0.9599999785423279
     f32.mul
     f32.const 9.999999974752427e-07
     f32.max
    else
     local.get $1
    end
   else
    i32.const 1096
    f32.load
    local.set $20
    i32.const 1092
    f32.load
   end
   local.tee $64
   f32x4.splat
   local.set $49
   local.get $17
   local.get $20
   local.get $64
   f32.sub
   f32.const 9.999999717180685e-10
   f32.max
   local.tee $56
   f32.div
   local.tee $38
   f32.neg
   f32x4.splat
   local.set $50
   local.get $31
   local.get $17
   f32.add
   local.tee $65
   f32x4.splat
   local.set $51
   local.get $64
   f32.const 0
   f32.gt
   local.get $22
   i32.and
   if (result f32)
    local.get $64
    call $~lib/math/NativeMathf.log
   else
    f32.const 0
   end
   local.set $18
   f32.const 1
   local.get $20
   f32.const 0
   f32.gt
   local.get $22
   i32.and
   if (result f32)
    local.get $20
    call $~lib/math/NativeMathf.log
   else
    f32.const 1
   end
   local.get $18
   f32.sub
   f32.const 9.999999717180685e-10
   f32.max
   local.tee $57
   f32.div
   local.set $21
   f32.const 1
   local.get $16
   f32.div
   local.tee $66
   local.get $33
   f32.const 0.1599999964237213
   f32.mul
   f32.const 2
   f32.min
   f32.max
   local.tee $59
   f32.const 0.5
   f32.mul
   local.set $60
   local.get $37
   if (result f32)
    local.get $2
    i32.const 2
    i32.shl
    local.tee $0
    i32.const 119808
    i32.add
    f32.load
    local.get $0
    i32.const 267264
    i32.add
    f32.load
    f32.add
    f32.const 0.5
    f32.mul
   else
    f32.const 0
   end
   local.set $9
   local.get $14
   i32.const 32
   i32.and
   i32.const 0
   i32.ne
   local.set $44
   local.get $29
   i32.const 2
   i32.and
   i32.const 0
   i32.ne
   local.set $46
   local.get $29
   i32.const 4
   i32.and
   i32.const 0
   i32.ne
   local.set $47
   local.get $29
   i32.const 8
   i32.and
   i32.const 0
   i32.ne
   local.set $48
   f32.const 1
   local.get $8
   f32.div
   local.set $55
   local.get $33
   f32.const 0.5
   f32.mul
   local.set $58
   local.get $2
   local.set $0
   loop $for-loop|1
    local.get $0
    local.get $25
    i32.lt_s
    if
     local.get $0
     i32.const 2
     i32.shl
     local.tee $11
     i32.const 119808
     i32.add
     f32.load
     local.set $3
     local.get $11
     i32.const 168960
     i32.add
     f32.load
     local.set $19
     local.get $11
     i32.const 218112
     i32.add
     f32.load
     local.set $6
     local.get $11
     i32.const 267264
     i32.add
     f32.load
     local.set $10
     local.get $11
     i32.const 316416
     i32.add
     f32.load
     local.set $61
     local.get $37
     if (result f32)
      local.get $9
      local.tee $1
      local.get $3
      local.get $19
      f32.add
      local.get $6
      f32.add
      local.get $10
      f32.add
      f32.const 0.25
      f32.mul
      local.tee $10
      f32.add
      f32.const 0.5
      f32.mul
      local.set $9
      local.get $10
      local.get $1
      local.tee $3
      f32.max
      local.get $19
      f32.max
      local.set $19
      local.get $3
      local.get $10
      f32.min
      local.get $6
      f32.min
     else
      local.get $6
     end
     local.set $1
     local.get $3
     local.get $10
     f32.le
     local.tee $62
     if
      local.get $52
      i32.const 1
      i32.add
      local.set $52
     else
      local.get $53
      i32.const 1
      i32.add
      local.set $53
     end
     local.get $35
     local.get $26
     i32.const 1
     i32.sub
     local.get $0
     i32.sub
     f32.convert_i32_s
     local.get $23
     f32.mul
     f32.sub
     local.set $67
     local.get $22
     if (result f32)
      local.get $65
      local.get $19
      f32.const 9.999999717180685e-10
      f32.max
      call $~lib/math/NativeMathf.log
      local.get $18
      f32.sub
      local.get $21
      f32.mul
      local.get $17
      f32.mul
      f32.sub
      local.set $19
      local.get $65
      local.get $1
      f32.const 9.999999717180685e-10
      f32.max
      call $~lib/math/NativeMathf.log
      local.get $18
      f32.sub
      local.get $21
      f32.mul
      local.get $17
      f32.mul
      f32.sub
      local.set $24
      local.get $65
      local.get $3
      f32.const 9.999999717180685e-10
      f32.max
      call $~lib/math/NativeMathf.log
      local.get $18
      f32.sub
      local.get $21
      f32.mul
      local.get $17
      f32.mul
      f32.sub
      local.set $3
      local.get $65
      local.get $10
      f32.const 9.999999717180685e-10
      f32.max
      call $~lib/math/NativeMathf.log
      local.get $18
      f32.sub
      local.get $21
      f32.mul
      local.get $17
      f32.mul
      f32.sub
     else
      local.get $51
      local.get $3
      f32x4.splat
      local.get $19
      f32x4.replace_lane 1
      local.get $1
      f32x4.replace_lane 2
      local.get $10
      f32x4.replace_lane 3
      local.get $49
      f32x4.sub
      local.get $50
      f32x4.mul
      f32x4.add
      local.tee $15
      f32x4.extract_lane 0
      local.set $3
      local.get $15
      f32x4.extract_lane 1
      local.set $19
      local.get $15
      f32x4.extract_lane 2
      local.set $24
      local.get $15
      f32x4.extract_lane 3
     end
     local.set $12
     local.get $27
     i32.const 4
     i32.shl
     local.tee $5
     i32.const 721920
     i32.add
     local.get $67
     local.get $58
     f32.sub
     local.get $16
     f32.mul
     local.tee $6
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $6
     f32.le
     select
     local.get $16
     f32.div
     local.tee $10
     f32.store
     local.get $5
     i32.const 721924
     i32.add
     local.get $3
     local.get $12
     local.get $3
     local.get $12
     f32.lt
     select
     local.get $16
     f32.mul
     local.tee $6
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $6
     f32.le
     select
     local.get $16
     f32.div
     local.tee $6
     f32.store
     local.get $5
     i32.const 721928
     i32.add
     local.get $33
     f32.store
     local.get $5
     i32.const 721932
     i32.add
     local.get $3
     local.get $12
     local.get $3
     local.get $12
     f32.gt
     select
     local.get $16
     f32.mul
     local.tee $3
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $3
     f32.le
     select
     local.get $16
     f32.div
     local.get $6
     f32.sub
     local.get $66
     f32.max
     f32.store
     local.get $5
     i32.const 762880
     i32.add
     local.get $67
     local.get $60
     f32.sub
     local.get $16
     f32.mul
     local.tee $3
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $3
     f32.le
     select
     local.get $16
     f32.div
     f32.store
     local.get $5
     i32.const 762884
     i32.add
     local.get $19
     local.get $16
     f32.mul
     local.tee $3
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $3
     f32.le
     select
     local.get $16
     f32.div
     local.tee $6
     f32.store
     local.get $5
     i32.const 762888
     i32.add
     local.get $59
     f32.store
     local.get $5
     i32.const 762892
     i32.add
     local.get $24
     local.get $16
     f32.mul
     local.tee $3
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $3
     f32.le
     select
     local.get $16
     f32.div
     local.get $6
     f32.sub
     local.get $66
     f32.max
     f32.store
     local.get $5
     i32.const 803840
     i32.add
     local.get $10
     f32.store
     local.get $5
     i32.const 803844
     i32.add
     local.get $41
     local.get $32
     f32.add
     local.get $61
     local.get $55
     f32.mul
     f32.const 1
     f32.min
     f32.const 0
     f32.max
     local.get $32
     f32.mul
     local.get $16
     f32.mul
     local.tee $3
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $3
     f32.le
     select
     local.get $16
     f32.div
     local.get $66
     f32.max
     local.tee $6
     f32.sub
     local.get $16
     f32.mul
     local.tee $3
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $3
     f32.le
     select
     local.get $16
     f32.div
     f32.store
     local.get $5
     i32.const 803848
     i32.add
     local.get $33
     f32.store
     local.get $5
     i32.const 803852
     i32.add
     local.get $6
     f32.store
     local.get $27
     i32.const 844800
     i32.add
     local.get $62
     local.get $0
     i32.const 709632
     i32.add
     i32.load8_u
     i32.const -2
     i32.and
     i32.or
     i32.store8
     local.get $27
     i32.const 3
     i32.shl
     local.set $5
     local.get $29
     if
      local.get $22
      if
       local.get $45
       if
        local.get $11
        i32.const 365568
        i32.add
        f32.load
        local.set $1
        local.get $5
        i32.const 847360
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 847364
        i32.add
        local.get $65
        local.get $1
        f32.const 9.999999717180685e-10
        f32.max
        call $~lib/math/NativeMathf.log
        local.get $18
        f32.sub
        local.get $21
        f32.mul
        local.get $17
        f32.mul
        f32.sub
        f32.store
       end
       local.get $46
       if
        local.get $11
        i32.const 414720
        i32.add
        f32.load
        local.set $1
        local.get $5
        i32.const 867840
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 867844
        i32.add
        local.get $65
        local.get $1
        f32.const 9.999999717180685e-10
        f32.max
        call $~lib/math/NativeMathf.log
        local.get $18
        f32.sub
        local.get $21
        f32.mul
        local.get $17
        f32.mul
        f32.sub
        f32.store
       end
       local.get $47
       if
        local.get $11
        i32.const 463872
        i32.add
        f32.load
        local.set $1
        local.get $5
        i32.const 888320
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 888324
        i32.add
        local.get $65
        local.get $1
        f32.const 9.999999717180685e-10
        f32.max
        call $~lib/math/NativeMathf.log
        local.get $18
        f32.sub
        local.get $21
        f32.mul
        local.get $17
        f32.mul
        f32.sub
        f32.store
       end
       local.get $48
       if
        local.get $11
        i32.const 513024
        i32.add
        f32.load
        local.set $1
        local.get $5
        i32.const 908800
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 908804
        i32.add
        local.get $65
        local.get $1
        f32.const 9.999999717180685e-10
        f32.max
        call $~lib/math/NativeMathf.log
        local.get $18
        f32.sub
        local.get $21
        f32.mul
        local.get $17
        f32.mul
        f32.sub
        f32.store
       end
      else
       local.get $51
       local.get $11
       i32.const 365568
       i32.add
       f32.load
       f32x4.splat
       local.get $11
       i32.const 414720
       i32.add
       f32.load
       f32x4.replace_lane 1
       local.get $11
       i32.const 463872
       i32.add
       f32.load
       f32x4.replace_lane 2
       local.get $11
       i32.const 513024
       i32.add
       f32.load
       f32x4.replace_lane 3
       local.get $49
       f32x4.sub
       local.get $50
       f32x4.mul
       f32x4.add
       local.set $15
       local.get $45
       if
        local.get $5
        i32.const 847360
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 847364
        i32.add
        local.get $15
        f32x4.extract_lane 0
        f32.store
       end
       local.get $46
       if
        local.get $5
        i32.const 867840
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 867844
        i32.add
        local.get $15
        f32x4.extract_lane 1
        f32.store
       end
       local.get $47
       if
        local.get $5
        i32.const 888320
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 888324
        i32.add
        local.get $15
        f32x4.extract_lane 2
        f32.store
       end
       local.get $48
       if
        local.get $5
        i32.const 908800
        i32.add
        local.get $67
        f32.store
        local.get $5
        i32.const 908804
        i32.add
        local.get $15
        f32x4.extract_lane 3
        f32.store
       end
      end
     end
     local.get $43
     if
      local.get $11
      i32.const 562176
      i32.add
      f32.load
      local.set $3
      local.get $11
      i32.const 611328
      i32.add
      f32.load
      local.set $1
      local.get $22
      if (result f32)
       local.get $65
       local.get $3
       f32.const 9.999999717180685e-10
       f32.max
       call $~lib/math/NativeMathf.log
       local.get $18
       f32.sub
       local.get $21
       f32.mul
       local.get $17
       f32.mul
       f32.sub
      else
       local.get $65
       local.get $3
       local.get $64
       f32.sub
       local.get $38
       f32.mul
       f32.sub
      end
      local.set $3
      local.get $22
      if (result f32)
       local.get $65
       local.get $1
       f32.const 9.999999717180685e-10
       f32.max
       call $~lib/math/NativeMathf.log
       local.get $18
       f32.sub
       local.get $21
       f32.mul
       local.get $17
       f32.mul
       f32.sub
      else
       local.get $65
       local.get $1
       local.get $64
       f32.sub
       local.get $38
       f32.mul
       f32.sub
      end
      local.set $1
      local.get $5
      i32.const 929280
      i32.add
      local.get $67
      f32.store
      local.get $5
      i32.const 929284
      i32.add
      local.get $3
      f32.store
      local.get $5
      i32.const 949760
      i32.add
      local.get $67
      f32.store
      local.get $5
      i32.const 949764
      i32.add
      local.get $1
      f32.store
     end
     local.get $28
     f32.const 10
     f32.gt
     local.get $44
     i32.and
     if
      local.get $42
      local.get $28
      f32.add
      local.get $11
      i32.const 660480
      i32.add
      f32.load
      f32.const 100
      f32.min
      f32.const 0
      f32.max
      f32.const 100
      f32.div
      local.get $28
      f32.mul
      f32.sub
      local.set $1
      local.get $5
      i32.const 970240
      i32.add
      local.get $67
      f32.store
      local.get $5
      i32.const 970244
      i32.add
      local.get $1
      f32.store
     end
     local.get $27
     i32.const 1
     i32.add
     local.set $27
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|1
    end
   end
   i32.const -1
   local.set $0
   f32.const -1
   local.set $9
   local.get $30
   local.get $36
   f32.le
   local.get $36
   local.get $30
   local.get $40
   f32.add
   f32.le
   i32.and
   local.get $31
   local.get $34
   f32.le
   i32.and
   local.get $42
   local.get $28
   f32.add
   local.get $41
   local.get $32
   f32.add
   local.get $65
   local.get $32
   f32.const 0
   f32.gt
   select
   local.get $28
   f32.const 10
   f32.gt
   local.get $44
   i32.and
   select
   local.get $34
   f32.ge
   i32.and
   if (result f32)
    local.get $14
    i32.const 64
    i32.and
    i32.const 0
    i32.ne
    local.set $14
    local.get $26
    i32.const 1
    i32.sub
    local.tee $11
    f32.convert_i32_s
    local.get $35
    local.get $36
    f32.sub
    local.get $23
    f32.div
    f32.sub
    local.tee $3
    f32.ceil
    local.tee $1
    local.get $1
    f32.const -1
    f32.add
    local.get $1
    f32.const -0.5
    f32.add
    local.get $3
    f32.le
    select
    i32.trunc_sat_f32_s
    local.tee $5
    local.get $2
    i32.ge_s
    local.get $5
    local.get $25
    i32.lt_s
    i32.and
    if (result f32)
     local.get $35
     local.get $11
     local.get $5
     local.tee $0
     i32.sub
     f32.convert_i32_s
     local.get $23
     f32.mul
     f32.sub
     local.get $16
     f32.mul
     local.tee $3
     f32.ceil
     local.tee $1
     local.get $1
     f32.const -1
     f32.add
     local.get $1
     f32.const -0.5
     f32.add
     local.get $3
     f32.le
     select
     local.get $16
     f32.div
    else
     f32.const -1
    end
    local.set $9
    local.get $65
    local.get $34
    local.get $65
    f32.min
    local.get $31
    f32.max
    f32.sub
    local.get $17
    f32.const 1
    f32.max
    f32.div
    local.set $1
    local.get $22
    if (result f32)
     local.get $18
     local.get $1
     local.get $57
     f32.mul
     f32.add
     local.tee $1
     f64.promote_f32
     local.set $13
     block $~lib/util/math/expf_lut|inlined.0 (result f32)
      local.get $1
      i32.reinterpret_f32
      local.tee $11
      i32.const 20
      i32.shr_u
      i32.const 2047
      i32.and
      local.tee $5
      i32.const 1067
      i32.ge_u
      if
       f32.const 0
       local.get $11
       i32.const -8388608
       i32.eq
       br_if $~lib/util/math/expf_lut|inlined.0
       drop
       local.get $1
       local.get $1
       f32.add
       local.get $5
       i32.const 2040
       i32.ge_u
       br_if $~lib/util/math/expf_lut|inlined.0
       drop
       local.get $1
       f32.const 1701411834604692317316873e14
       f32.mul
       local.get $1
       f32.const 88.72283172607422
       f32.gt
       br_if $~lib/util/math/expf_lut|inlined.0
       drop
       f32.const 0
       local.get $1
       f32.const -103.97207641601562
       f32.lt
       br_if $~lib/util/math/expf_lut|inlined.0
       drop
      end
      local.get $13
      f64.const 46.16624130844683
      f64.mul
      local.tee $13
      f64.const 6755399441055744
      f64.add
      local.tee $63
      i64.reinterpret_f64
      local.set $54
      local.get $13
      local.get $63
      f64.const -6755399441055744
      f64.add
      f64.sub
      local.tee $13
      f64.const 0.021660849396613134
      f64.mul
      f64.const 1
      f64.add
      local.get $13
      f64.const 1.6938359250920212e-06
      f64.mul
      f64.const 2.3459809789509004e-04
      f64.add
      local.get $13
      local.get $13
      f64.mul
      f64.mul
      f64.add
      local.get $54
      i32.wrap_i64
      i32.const 31
      i32.and
      i32.const 3
      i32.shl
      i32.const 991232
      i32.add
      i64.load
      local.get $54
      i64.const 47
      i64.shl
      i64.add
      f64.reinterpret_i64
      f64.mul
      f32.demote_f64
     end
    else
     local.get $64
     local.get $1
     local.get $56
     f32.mul
     f32.add
    end
    local.set $1
    local.get $0
    i32.const 0
    i32.ge_s
    local.get $14
    i32.and
    local.get $34
    local.get $65
    f32.le
    i32.and
    if (result f32)
     local.get $0
     i32.const 2
     i32.shl
     i32.const 267264
     i32.add
     f32.load
    else
     local.get $1
    end
   else
    f32.const 0
   end
   local.set $12
   local.get $64
   local.get $20
   local.get $31
   local.get $17
   local.get $22
   local.get $16
   call $assembly/engine/computeNiceGrid
   local.set $11
   local.get $26
   i32.const 1
   i32.sub
   i32.const 2
   i32.shl
   local.tee $5
   i32.const 267264
   i32.add
   f32.load
   local.set $10
   local.get $2
   i32.const 2
   i32.shl
   i32.const 119808
   i32.add
   f32.load
   local.tee $6
   f32.const 9.999999717180685e-10
   f32.gt
   if (result f32)
    local.get $10
    local.get $6
    f32.sub
    local.get $6
    f32.div
    f32.const 100
    f32.mul
   else
    f32.const 0
   end
   local.set $3
   local.get $22
   if (result f32)
    local.get $65
    local.get $10
    f32.const 9.999999717180685e-10
    f32.max
    call $~lib/math/NativeMathf.log
    local.get $18
    f32.sub
    local.get $21
    f32.mul
    local.get $17
    f32.mul
    f32.sub
   else
    local.get $65
    local.get $10
    local.get $64
    f32.sub
    local.get $38
    f32.mul
    f32.sub
   end
   local.set $1
   i32.const 3072
   local.get $2
   i32.store
   i32.const 3076
   local.get $25
   i32.store
   i32.const 3080
   local.get $27
   i32.store
   i32.const 3084
   local.get $64
   f32.store
   i32.const 3088
   local.get $20
   f32.store
   i32.const 3092
   local.get $4
   f32.store
   i32.const 3096
   local.get $7
   f32.store
   i32.const 3100
   local.get $8
   f32.store
   i32.const 3104
   local.get $0
   i32.store
   i32.const 3108
   local.get $9
   f32.store
   i32.const 3112
   local.get $12
   f32.store
   i32.const 3116
   local.get $11
   i32.store
   i32.const 3120
   local.get $10
   f32.store
   i32.const 3124
   local.get $6
   f32.store
   i32.const 3128
   local.get $3
   f32.store
   i32.const 3132
   local.get $1
   local.get $16
   f32.mul
   local.tee $3
   f32.ceil
   local.tee $1
   local.get $1
   f32.const -1
   f32.add
   local.get $1
   f32.const -0.5
   f32.add
   local.get $3
   f32.le
   select
   local.get $16
   f32.div
   f32.store
   i32.const 3136
   local.get $52
   i32.store
   i32.const 3140
   local.get $53
   i32.store
   i32.const 3144
   local.get $5
   i32.const 365568
   i32.add
   f32.load
   f32.store
   i32.const 3148
   local.get $5
   i32.const 414720
   i32.add
   f32.load
   f32.store
   i32.const 3164
   local.get $5
   i32.const 463872
   i32.add
   f32.load
   f32.store
   i32.const 3168
   local.get $5
   i32.const 513024
   i32.add
   f32.load
   f32.store
   i32.const 3152
   local.get $5
   i32.const 660480
   i32.add
   f32.load
   f32.store
   i32.const 3156
   local.get $5
   i32.const 562176
   i32.add
   f32.load
   f32.store
   i32.const 3160
   local.get $5
   i32.const 611328
   i32.add
   f32.load
   f32.store
   local.get $39
   global.set $assembly/arena/Arena.current
   local.get $27
   return
  end
  i32.const 3080
  i32.const 0
  i32.store
  i32.const 3104
  i32.const -1
  i32.store
  i32.const 3116
  i32.const 0
  i32.store
  local.get $39
  global.set $assembly/arena/Arena.current
  i32.const 0
 )
 (func $assembly/engine/initEngine
  i32.const 1024
  i32.const 0
  i32.const 989952
  memory.fill
  i32.const 5120
  global.set $assembly/arena/Arena.current
  f64.const 0
  global.set $assembly/engine/rsiBaseGain
  f64.const 0
  global.set $assembly/engine/rsiBaseLoss
  f64.const 0
  global.set $assembly/engine/rsiCurGain
  f64.const 0
  global.set $assembly/engine/rsiCurLoss
  i32.const -1
  global.set $assembly/engine/rsiStateIdx
  i32.const 1080
  i32.const 9
  i32.store
  i32.const 1084
  i32.const 21
  i32.store
  i32.const 1124
  i32.const 50
  i32.store
  i32.const 1128
  i32.const 200
  i32.store
  i32.const 1132
  i32.const 3
  i32.store
  i32.const 1116
  i32.const 20
  i32.store
  i32.const 1120
  f32.const 2
  f32.store
  i32.const 1088
  i32.const 3
  i32.store
  i32.const 1100
  f32.const 0.07999999821186066
  f32.store
  i32.const 1104
  f32.const 1
  f32.store
 )
 (func $assembly/engine/computeNiceGrid (param $0 f32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 i32) (param $5 f32) (result i32)
  (local $6 f64)
  (local $7 i32)
  (local $8 i32)
  (local $9 i64)
  (local $10 i32)
  (local $11 f32)
  (local $12 f32)
  (local $13 f32)
  (local $14 f32)
  (local $15 f32)
  (local $16 f32)
  (local $17 i32)
  (local $18 f64)
  (local $19 f64)
  (local $20 f64)
  (local $21 f64)
  (local $22 f64)
  (local $23 f64)
  local.get $3
  f32.const 10
  f32.le
  local.get $1
  local.get $0
  f32.sub
  local.tee $13
  f32.const 9.999999717180685e-10
  f32.le
  i32.or
  if
   i32.const 0
   return
  end
  block $__inlined_func$~lib/math/NativeMath.log10 (result f64)
   local.get $13
   f64.promote_f32
   local.get $3
   f32.const 58
   f32.div
   f32.floor
   f32.const 10
   f32.min
   f32.const 3
   f32.max
   i32.trunc_sat_f32_s
   f64.convert_i32_s
   f64.div
   local.tee $18
   i64.reinterpret_f64
   local.tee $9
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   local.tee $7
   i32.const 31
   i32.shr_u
   local.tee $17
   local.get $7
   i32.const 1048576
   i32.lt_u
   i32.or
   if
    f64.const -1
    local.get $18
    local.get $18
    f64.mul
    f64.div
    local.get $9
    i64.const 1
    i64.shl
    i64.eqz
    br_if $__inlined_func$~lib/math/NativeMath.log10
    drop
    local.get $18
    local.get $18
    f64.sub
    f64.const 0
    f64.div
    local.get $17
    br_if $__inlined_func$~lib/math/NativeMath.log10
    drop
    i32.const -54
    local.set $8
    local.get $18
    f64.const 18014398509481984
    f64.mul
    i64.reinterpret_f64
    local.tee $9
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    local.set $7
   else
    local.get $7
    i32.const 2146435072
    i32.ge_u
    if
     local.get $18
     br $__inlined_func$~lib/math/NativeMath.log10
    else
     f64.const 0
     local.get $9
     i64.const 32
     i64.shl
     i64.eqz
     local.get $7
     i32.const 1072693248
     i32.eq
     i32.and
     br_if $__inlined_func$~lib/math/NativeMath.log10
     drop
    end
   end
   local.get $9
   i64.const 4294967295
   i64.and
   local.get $7
   i32.const 614242
   i32.add
   local.tee $7
   i32.const 1048575
   i32.and
   i32.const 1072079006
   i32.add
   i64.extend_i32_u
   i64.const 32
   i64.shl
   i64.or
   f64.reinterpret_i64
   f64.const -1
   f64.add
   local.tee $6
   f64.const 0.5
   f64.mul
   local.get $6
   f64.mul
   local.set $19
   local.get $6
   local.get $6
   f64.const 2
   f64.add
   f64.div
   local.tee $20
   local.get $20
   f64.mul
   local.tee $21
   local.get $21
   f64.mul
   local.set $22
   local.get $6
   local.get $6
   local.get $19
   f64.sub
   i64.reinterpret_f64
   i64.const -4294967296
   i64.and
   f64.reinterpret_i64
   local.tee $23
   f64.sub
   local.get $19
   f64.sub
   local.get $20
   local.get $19
   local.get $21
   local.get $22
   local.get $22
   local.get $22
   f64.const 0.14798198605116586
   f64.mul
   f64.const 0.1818357216161805
   f64.add
   f64.mul
   f64.const 0.2857142874366239
   f64.add
   f64.mul
   f64.const 0.6666666666666735
   f64.add
   f64.mul
   local.get $22
   local.get $22
   local.get $22
   f64.const 0.15313837699209373
   f64.mul
   f64.const 0.22222198432149784
   f64.add
   f64.mul
   f64.const 0.3999999999940942
   f64.add
   f64.mul
   f64.add
   f64.add
   f64.mul
   f64.add
   local.set $19
   local.get $8
   local.get $7
   i32.const 20
   i32.shr_u
   i32.const 1023
   i32.sub
   i32.add
   f64.convert_i32_s
   local.tee $20
   f64.const 0.30102999566361177
   f64.mul
   local.tee $21
   local.get $23
   f64.const 0.4342944818781689
   f64.mul
   local.tee $22
   f64.add
   local.set $6
   local.get $20
   f64.const 3.694239077158931e-13
   f64.mul
   local.get $19
   local.get $23
   f64.add
   f64.const 2.5082946711645275e-11
   f64.mul
   f64.add
   local.get $19
   f64.const 0.4342944818781689
   f64.mul
   f64.add
   local.get $21
   local.get $6
   f64.sub
   local.get $22
   f64.add
   f64.add
   local.get $6
   f64.add
  end
  f64.floor
  call $~lib/math/NativeMath.pow
  local.set $6
  local.get $0
  f64.promote_f32
  local.get $18
  local.get $6
  f64.div
  local.tee $18
  f64.const 1.5
  f64.lt
  if (result f64)
   f64.const 1
  else
   local.get $18
   f64.const 3
   f64.lt
   if (result f64)
    f64.const 2
   else
    f64.const 5
    f64.const 10
    local.get $18
    f64.const 7
    f64.lt
    select
   end
  end
  local.get $6
  f64.mul
  local.tee $18
  f64.div
  f64.ceil
  local.get $18
  f64.mul
  local.set $6
  local.get $0
  f32.const 0
  f32.gt
  i32.const 0
  local.get $4
  select
  if (result f32)
   local.get $0
   call $~lib/math/NativeMathf.log
  else
   f32.const 0
  end
  local.set $14
  local.get $1
  f32.const 0
  f32.gt
  i32.const 0
  local.get $4
  select
  if (result f32)
   local.get $1
   call $~lib/math/NativeMathf.log
  else
   f32.const 1
  end
  local.get $14
  f32.sub
  local.set $15
  loop $while-continue|0
   local.get $10
   i32.const 32
   i32.lt_s
   local.get $6
   local.get $1
   f64.promote_f32
   f64.le
   i32.and
   if
    local.get $2
    local.get $3
    f32.add
    local.get $15
    f32.const 9.999999717180685e-10
    f32.gt
    i32.const 0
    local.get $6
    f32.demote_f64
    local.tee $11
    f32.const 0
    f32.gt
    i32.const 0
    local.get $4
    select
    select
    if (result f32)
     local.get $11
     call $~lib/math/NativeMathf.log
     local.get $14
     f32.sub
     local.get $15
     f32.div
    else
     local.get $11
     local.get $0
     f32.sub
     local.get $13
     f32.div
    end
    local.get $3
    f32.mul
    f32.sub
    local.get $5
    f32.mul
    local.tee $16
    f32.ceil
    local.set $12
    local.get $10
    i32.const 2
    i32.shl
    local.tee $7
    i32.const 990720
    i32.add
    local.get $11
    f32.store
    local.get $7
    i32.const 990848
    i32.add
    local.get $12
    local.get $12
    f32.const -1
    f32.add
    local.get $12
    f32.const -0.5
    f32.add
    local.get $16
    f32.le
    select
    local.get $5
    f32.div
    f32.store
    local.get $10
    i32.const 1
    i32.add
    local.set $10
    local.get $6
    local.get $18
    f64.add
    local.set $6
    br $while-continue|0
   end
  end
  local.get $10
 )
 (func $assembly/engine/computeIndicators (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 f64)
  (local $5 f32)
  (local $6 f64)
  (local $7 f64)
  (local $8 f32)
  (local $9 f64)
  (local $10 f64)
  (local $11 f32)
  (local $12 f32)
  (local $13 f32)
  (local $14 f32)
  (local $15 f32)
  (local $16 f32)
  (local $17 f32)
  (local $18 f64)
  (local $19 f64)
  (local $20 i32)
  (local $21 i32)
  (local $22 f32)
  (local $23 f32)
  (local $24 f32)
  (local $25 f32)
  (local $26 f32)
  (local $27 f32)
  (local $28 f32)
  (local $29 f32)
  (local $30 f32)
  (local $31 f32)
  (local $32 i32)
  (local $33 f64)
  i32.const 1024
  i32.load
  local.set $32
  i32.const 1080
  i32.const 9
  i32.const 500
  local.get $0
  local.get $0
  i32.const 500
  i32.gt_s
  select
  local.get $0
  i32.const 2
  i32.lt_s
  select
  local.tee $21
  i32.store
  i32.const 1084
  i32.const 21
  i32.const 500
  local.get $1
  local.get $1
  i32.const 500
  i32.gt_s
  select
  local.get $1
  i32.const 2
  i32.lt_s
  select
  local.tee $20
  i32.store
  i32.const 1124
  i32.const 50
  i32.const 500
  local.get $2
  local.get $2
  i32.const 500
  i32.gt_s
  select
  local.get $2
  i32.const 2
  i32.lt_s
  select
  local.tee $2
  i32.store
  i32.const 1128
  i32.const 200
  i32.const 500
  local.get $3
  local.get $3
  i32.const 500
  i32.gt_s
  select
  local.get $3
  i32.const 2
  i32.lt_s
  select
  local.tee $1
  i32.store
  i32.const 20
  i32.const 1116
  i32.load
  local.tee $0
  local.get $0
  i32.const 2
  i32.le_s
  select
  local.set $3
  i32.const 1120
  f32.load
  local.tee $5
  f32.const 2
  local.get $5
  f32.const 0.10000000149011612
  f32.gt
  select
  local.set $30
  local.get $32
  i32.const 0
  i32.le_s
  if
   i32.const -1
   global.set $assembly/engine/rsiStateIdx
   return
  end
  f32.const 1
  f32.const 2
  local.get $21
  f32.convert_i32_s
  f32.const 1
  f32.add
  f32.div
  local.tee $29
  f32.sub
  local.set $28
  f32.const 1
  f32.const 2
  local.get $20
  f32.convert_i32_s
  f32.const 1
  f32.add
  f32.div
  local.tee $27
  f32.sub
  local.set $26
  f32.const 1
  f32.const 2
  local.get $2
  f32.convert_i32_s
  f32.const 1
  f32.add
  f32.div
  local.tee $25
  f32.sub
  local.set $24
  f32.const 1
  f32.const 2
  local.get $1
  f32.convert_i32_s
  f32.const 1
  f32.add
  f32.div
  local.tee $23
  f32.sub
  local.set $22
  i32.const 267264
  f32.load
  local.tee $5
  local.set $31
  i32.const 365568
  local.get $5
  f32.store
  i32.const 414720
  local.get $5
  local.tee $11
  f32.store
  local.get $5
  local.set $8
  i32.const 463872
  local.get $5
  f32.store
  i32.const 513024
  local.get $5
  f32.store
  i32.const 562176
  local.get $5
  f32.store
  i32.const 611328
  local.get $5
  f32.store
  i32.const 660480
  f32.const 50
  f32.store
  i32.const 267264
  f32.load
  local.tee $17
  i32.const 119808
  f32.load
  local.tee $16
  f32.sub
  f32.abs
  local.set $15
  local.get $16
  local.get $17
  f32.le
  local.set $1
  i32.const 709632
  i32.const 168960
  f32.load
  local.tee $13
  i32.const 218112
  f32.load
  local.tee $14
  f32.sub
  local.tee $12
  f32.const 9.999999717180685e-10
  f32.gt
  if (result i32)
   local.get $1
   i32.const 2
   i32.or
   local.get $1
   local.get $15
   local.get $12
   f32.const 0.11999999731779099
   f32.mul
   f32.le
   select
   local.set $0
   local.get $15
   f32.const 0
   f32.gt
   if (result i32)
    local.get $13
    local.get $17
    local.get $16
    local.get $1
    select
    f32.sub
    local.tee $13
    local.get $15
    f32.const 0.6000000238418579
    f32.mul
    f32.le
    local.get $16
    local.get $17
    local.get $1
    select
    local.get $14
    f32.sub
    local.tee $12
    local.get $15
    local.get $15
    f32.add
    f32.ge
    i32.and
    if (result i32)
     local.get $0
     i32.const 4
     i32.or
    else
     local.get $0
     i32.const 4
     i32.or
     local.get $0
     local.get $12
     local.get $15
     f32.const 0.6000000238418579
     f32.mul
     f32.le
     local.get $13
     local.get $15
     local.get $15
     f32.add
     f32.ge
     i32.and
     select
    end
   else
    local.get $0
   end
  else
   local.get $1
  end
  i32.store8
  local.get $5
  f64.promote_f32
  local.tee $33
  local.get $33
  f64.mul
  local.set $6
  i32.const 1
  local.set $0
  loop $for-loop|0
   local.get $0
   local.get $32
   i32.lt_s
   if
    local.get $0
    i32.const 2
    i32.shl
    local.tee $2
    i32.const 267260
    i32.add
    f32.load
    local.set $13
    local.get $2
    i32.const 365568
    i32.add
    local.get $2
    i32.const 267264
    i32.add
    f32.load
    local.tee $12
    local.get $29
    f32.mul
    local.get $31
    local.get $28
    f32.mul
    f32.add
    local.tee $31
    f32.store
    local.get $2
    i32.const 414720
    i32.add
    local.get $12
    local.get $27
    f32.mul
    local.get $11
    local.get $26
    f32.mul
    f32.add
    local.tee $11
    f32.store
    local.get $2
    i32.const 463872
    i32.add
    local.get $12
    local.get $25
    f32.mul
    local.get $8
    local.get $24
    f32.mul
    f32.add
    local.tee $8
    f32.store
    local.get $2
    i32.const 513024
    i32.add
    local.get $12
    local.get $23
    f32.mul
    local.get $5
    local.get $22
    f32.mul
    f32.add
    local.tee $5
    f32.store
    local.get $33
    local.get $12
    f64.promote_f32
    local.tee $18
    f64.add
    local.set $33
    local.get $6
    local.get $18
    local.get $18
    f64.mul
    f64.add
    local.set $6
    local.get $0
    local.get $3
    i32.ge_s
    if
     local.get $33
     local.get $0
     local.get $3
     i32.sub
     i32.const 2
     i32.shl
     i32.const 267264
     i32.add
     f32.load
     f64.promote_f32
     local.tee $18
     f64.sub
     local.set $33
     local.get $6
     local.get $18
     local.get $18
     f64.mul
     f64.sub
     local.set $6
    end
    local.get $2
    i32.const 562176
    i32.add
    local.get $33
    local.get $0
    i32.const 1
    i32.add
    local.tee $1
    local.get $3
    local.get $1
    local.get $3
    i32.lt_s
    select
    f64.convert_i32_s
    local.tee $18
    f64.div
    local.tee $19
    local.get $6
    local.get $18
    f64.div
    local.get $19
    local.get $19
    f64.mul
    f64.sub
    f64.const 0
    f64.max
    f64.sqrt
    local.get $30
    f64.promote_f32
    f64.mul
    local.tee $18
    f64.add
    f32.demote_f64
    f32.store
    local.get $2
    i32.const 611328
    i32.add
    local.get $19
    local.get $18
    f64.sub
    f32.demote_f64
    f32.store
    local.get $12
    local.get $13
    f32.sub
    f64.promote_f32
    local.tee $18
    f64.const 0
    local.get $18
    f64.const 0
    f64.gt
    select
    local.set $19
    local.get $18
    f64.neg
    f64.const 0
    local.get $18
    f64.const 0
    f64.lt
    select
    local.set $18
    local.get $0
    i32.const 14
    i32.le_s
    if
     local.get $10
     local.get $19
     f64.add
     local.set $10
     local.get $9
     local.get $18
     f64.add
     local.set $9
     local.get $0
     i32.const 14
     i32.eq
     if
      local.get $9
      f64.const 14
      f64.div
      local.tee $9
      local.set $7
      local.get $10
      f64.const 14
      f64.div
      local.tee $10
      local.set $4
     end
     f32.const 100
     f32.const 50
     local.get $10
     local.get $0
     f64.convert_i32_s
     local.tee $18
     f64.div
     local.get $10
     local.get $0
     i32.const 14
     i32.lt_s
     local.tee $1
     select
     local.tee $19
     f64.const 1e-09
     f64.gt
     select
     local.set $12
     local.get $2
     i32.const 660480
     i32.add
     local.get $9
     local.get $18
     f64.div
     local.get $9
     local.get $1
     select
     local.tee $18
     f64.const 1e-09
     f64.lt
     if (result f32)
      local.get $12
     else
      f64.const 100
      f64.const 100
      local.get $19
      local.get $18
      f64.div
      f64.const 1
      f64.add
      f64.div
      f64.sub
      f32.demote_f64
     end
     f32.store
    else
     local.get $2
     i32.const 660480
     i32.add
     block $assembly/engine/rsiFromAvg|inlined.5 (result f32)
      f32.const 100
      f32.const 50
      local.get $10
      local.tee $4
      f64.const 13
      f64.mul
      local.get $19
      f64.add
      f64.const 14
      f64.div
      local.tee $10
      f64.const 1e-09
      f64.gt
      select
      local.get $9
      local.tee $7
      f64.const 13
      f64.mul
      local.get $18
      f64.add
      f64.const 14
      f64.div
      local.tee $9
      f64.const 1e-09
      f64.lt
      br_if $assembly/engine/rsiFromAvg|inlined.5
      drop
      f64.const 100
      f64.const 100
      local.get $10
      local.get $9
      f64.div
      f64.const 1
      f64.add
      f64.div
      f64.sub
      f32.demote_f64
     end
     f32.store
    end
    local.get $0
    i32.const 2
    i32.shl
    local.tee $2
    i32.const 119808
    i32.add
    f32.load
    local.set $17
    local.get $2
    i32.const 267264
    i32.add
    f32.load
    local.tee $16
    local.get $17
    f32.sub
    f32.abs
    local.set $15
    local.get $16
    local.get $17
    f32.ge
    local.set $1
    local.get $2
    i32.const 168960
    i32.add
    f32.load
    local.tee $13
    local.get $2
    i32.const 218112
    i32.add
    f32.load
    local.tee $14
    f32.sub
    local.tee $12
    f32.const 9.999999717180685e-10
    f32.gt
    if
     local.get $1
     i32.const 2
     i32.or
     local.get $1
     local.get $15
     local.get $12
     f32.const 0.11999999731779099
     f32.mul
     f32.le
     select
     local.set $2
     local.get $13
     local.get $16
     local.get $17
     local.get $1
     select
     f32.sub
     local.set $13
     local.get $17
     local.get $16
     local.get $1
     select
     local.get $14
     f32.sub
     local.set $12
     local.get $15
     f32.const 0
     f32.gt
     if (result i32)
      local.get $13
      local.get $15
      f32.const 0.6000000238418579
      f32.mul
      f32.le
      local.get $12
      local.get $15
      local.get $15
      f32.add
      f32.ge
      i32.and
      if (result i32)
       local.get $2
       i32.const 4
       i32.or
      else
       local.get $2
       i32.const 4
       i32.or
       local.get $2
       local.get $12
       local.get $15
       f32.const 0.6000000238418579
       f32.mul
       f32.le
       local.get $13
       local.get $15
       local.get $15
       f32.add
       f32.ge
       i32.and
       select
      end
     else
      local.get $2
     end
     local.set $1
    end
    local.get $0
    i32.const 709632
    i32.add
    local.get $0
    i32.const 0
    i32.gt_s
    if (result i32)
     local.get $0
     i32.const 1
     i32.sub
     i32.const 2
     i32.shl
     local.tee $2
     i32.const 119808
     i32.add
     f32.load
     local.tee $13
     local.get $2
     i32.const 267264
     i32.add
     f32.load
     local.tee $12
     f32.le
     local.get $16
     local.get $17
     f32.ge
     i32.ne
     if (result i32)
      local.get $15
      local.get $12
      local.get $13
      f32.sub
      f32.abs
      f32.const 1.0499999523162842
      f32.mul
      f32.gt
      if (result i32)
       local.get $1
       i32.const 8
       i32.or
       local.get $1
       local.get $16
       local.get $17
       local.get $16
       local.get $17
       f32.lt
       select
       local.get $12
       local.get $13
       local.get $12
       local.get $13
       f32.lt
       select
       f32.le
       local.get $16
       local.get $17
       local.get $16
       local.get $17
       f32.gt
       select
       local.get $12
       local.get $13
       local.get $12
       local.get $13
       f32.gt
       select
       f32.ge
       i32.and
       select
      else
       local.get $1
      end
     else
      local.get $1
     end
    else
     local.get $1
    end
    i32.store8
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  local.get $4
  global.set $assembly/engine/rsiBaseGain
  local.get $7
  global.set $assembly/engine/rsiBaseLoss
  local.get $10
  global.set $assembly/engine/rsiCurGain
  local.get $9
  global.set $assembly/engine/rsiCurLoss
  local.get $32
  i32.const 1
  i32.sub
  global.set $assembly/engine/rsiStateIdx
 )
 (func $assembly/engine/appendCandle (param $0 f64) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f32) (param $5 f32) (result i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 f64)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 f32)
  (local $14 f32)
  (local $15 i32)
  (local $16 f64)
  i32.const 1024
  i32.load
  local.tee $6
  i32.const 12288
  i32.ge_s
  if
   block $__inlined_func$assembly/engine/compactWindow$1
    local.get $6
    i32.const 2048
    i32.le_s
    if
     i32.const 1024
     i32.const 0
     i32.store
     i32.const -1
     global.set $assembly/engine/rsiStateIdx
     br $__inlined_func$assembly/engine/compactWindow$1
    end
    local.get $6
    i32.const 2048
    i32.sub
    local.tee $6
    i32.const 2
    i32.shl
    local.set $7
    i32.const 21504
    i32.const 37888
    local.get $6
    i32.const 3
    i32.shl
    memory.copy
    i32.const 119808
    i32.const 128000
    local.get $7
    memory.copy
    i32.const 168960
    i32.const 177152
    local.get $7
    memory.copy
    i32.const 218112
    i32.const 226304
    local.get $7
    memory.copy
    i32.const 267264
    i32.const 275456
    local.get $7
    memory.copy
    i32.const 316416
    i32.const 324608
    local.get $7
    memory.copy
    i32.const 365568
    i32.const 373760
    local.get $7
    memory.copy
    i32.const 414720
    i32.const 422912
    local.get $7
    memory.copy
    i32.const 463872
    i32.const 472064
    local.get $7
    memory.copy
    i32.const 513024
    i32.const 521216
    local.get $7
    memory.copy
    i32.const 562176
    i32.const 570368
    local.get $7
    memory.copy
    i32.const 611328
    i32.const 619520
    local.get $7
    memory.copy
    i32.const 660480
    i32.const 668672
    local.get $7
    memory.copy
    i32.const 709632
    i32.const 711680
    local.get $6
    memory.copy
    i32.const 1024
    local.get $6
    i32.store
    global.get $assembly/engine/rsiStateIdx
    i32.const 0
    i32.ge_s
    if
     global.get $assembly/engine/rsiStateIdx
     i32.const 2048
     i32.sub
     global.set $assembly/engine/rsiStateIdx
    end
   end
   i32.const 1024
   i32.load
   local.set $6
  end
  global.get $assembly/engine/rsiStateIdx
  local.get $6
  i32.const 1
  i32.sub
  i32.eq
  local.get $6
  i32.const 0
  i32.gt_s
  i32.and
  if
   global.get $assembly/engine/rsiCurGain
   global.set $assembly/engine/rsiBaseGain
   global.get $assembly/engine/rsiCurLoss
   global.set $assembly/engine/rsiBaseLoss
   local.get $6
   global.set $assembly/engine/rsiStateIdx
  end
  local.get $6
  i32.const 3
  i32.shl
  i32.const 21504
  i32.add
  local.get $0
  f64.store
  local.get $6
  i32.const 2
  i32.shl
  local.tee $7
  i32.const 119808
  i32.add
  local.tee $9
  local.get $1
  f32.store
  local.get $7
  i32.const 168960
  i32.add
  local.tee $10
  local.get $2
  f32.store
  local.get $7
  i32.const 218112
  i32.add
  local.tee $11
  local.get $3
  f32.store
  local.get $7
  i32.const 267264
  i32.add
  local.tee $12
  local.get $4
  f32.store
  local.get $7
  i32.const 316416
  i32.add
  local.get $5
  f32.store
  local.get $12
  f32.load
  local.tee $1
  local.get $9
  f32.load
  local.tee $3
  f32.sub
  f32.abs
  local.set $5
  local.get $1
  local.get $3
  f32.ge
  local.set $7
  local.get $10
  f32.load
  local.tee $13
  local.get $11
  f32.load
  local.tee $14
  f32.sub
  local.tee $2
  f32.const 9.999999717180685e-10
  f32.gt
  if
   local.get $7
   i32.const 2
   i32.or
   local.get $7
   local.get $5
   local.get $2
   f32.const 0.11999999731779099
   f32.mul
   f32.le
   select
   local.set $9
   local.get $13
   local.get $1
   local.get $3
   local.get $7
   select
   f32.sub
   local.set $2
   local.get $3
   local.get $1
   local.get $7
   select
   local.get $14
   f32.sub
   local.set $13
   local.get $5
   f32.const 0
   f32.gt
   if (result i32)
    local.get $2
    local.get $5
    f32.const 0.6000000238418579
    f32.mul
    f32.le
    local.get $13
    local.get $5
    local.get $5
    f32.add
    f32.ge
    i32.and
    if (result i32)
     local.get $9
     i32.const 4
     i32.or
    else
     local.get $9
     i32.const 4
     i32.or
     local.get $9
     local.get $13
     local.get $5
     f32.const 0.6000000238418579
     f32.mul
     f32.le
     local.get $2
     local.get $5
     local.get $5
     f32.add
     f32.ge
     i32.and
     select
    end
   else
    local.get $9
   end
   local.set $7
  end
  local.get $6
  i32.const 709632
  i32.add
  local.get $6
  i32.const 0
  i32.gt_s
  if (result i32)
   local.get $6
   i32.const 1
   i32.sub
   i32.const 2
   i32.shl
   local.tee $9
   i32.const 119808
   i32.add
   f32.load
   local.tee $2
   local.get $9
   i32.const 267264
   i32.add
   f32.load
   local.tee $13
   f32.le
   local.get $1
   local.get $3
   f32.ge
   i32.ne
   if (result i32)
    local.get $5
    local.get $13
    local.get $2
    f32.sub
    f32.abs
    f32.const 1.0499999523162842
    f32.mul
    f32.gt
    if (result i32)
     local.get $7
     i32.const 8
     i32.or
     local.get $7
     local.get $1
     local.get $3
     local.get $1
     local.get $3
     f32.lt
     select
     local.get $13
     local.get $2
     local.get $2
     local.get $13
     f32.gt
     select
     f32.le
     local.get $1
     local.get $3
     local.get $1
     local.get $3
     f32.gt
     select
     local.get $13
     local.get $2
     local.get $2
     local.get $13
     f32.lt
     select
     f32.ge
     i32.and
     select
    else
     local.get $7
    end
   else
    local.get $7
   end
  else
   local.get $7
  end
  i32.store8
  local.get $6
  i32.const 2
  i32.shl
  local.set $9
  i32.const 9
  i32.const 500
  i32.const 1080
  i32.load
  local.tee $7
  local.get $7
  i32.const 500
  i32.gt_s
  select
  local.get $7
  i32.const 2
  i32.lt_s
  select
  local.set $10
  i32.const 21
  i32.const 500
  i32.const 1084
  i32.load
  local.tee $7
  local.get $7
  i32.const 500
  i32.gt_s
  select
  local.get $7
  i32.const 2
  i32.lt_s
  select
  local.set $11
  i32.const 50
  i32.const 500
  i32.const 1124
  i32.load
  local.tee $7
  local.get $7
  i32.const 500
  i32.gt_s
  select
  local.get $7
  i32.const 2
  i32.lt_s
  select
  local.set $12
  i32.const 200
  i32.const 500
  i32.const 1128
  i32.load
  local.tee $7
  local.get $7
  i32.const 500
  i32.gt_s
  select
  local.get $7
  i32.const 2
  i32.lt_s
  select
  local.set $7
  block $assembly/engine/update4EmasAt|inlined.0
   local.get $6
   i32.eqz
   if
    i32.const 365568
    local.get $4
    f32.store
    i32.const 414720
    local.get $4
    f32.store
    i32.const 463872
    local.get $4
    f32.store
    i32.const 513024
    local.get $4
    f32.store
    br $assembly/engine/update4EmasAt|inlined.0
   end
   local.get $6
   i32.const 1
   i32.sub
   i32.const 2
   i32.shl
   local.tee $15
   i32.const 414720
   i32.add
   f32.load
   local.set $1
   local.get $15
   i32.const 463872
   i32.add
   f32.load
   local.set $2
   local.get $15
   i32.const 513024
   i32.add
   f32.load
   local.set $3
   local.get $9
   i32.const 365568
   i32.add
   local.get $4
   f32.const 2
   local.get $10
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $5
   f32.mul
   local.get $15
   i32.const 365568
   i32.add
   f32.load
   f32.const 1
   local.get $5
   f32.sub
   f32.mul
   f32.add
   f32.store
   local.get $9
   i32.const 414720
   i32.add
   local.get $4
   f32.const 2
   local.get $11
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $5
   f32.mul
   local.get $1
   f32.const 1
   local.get $5
   f32.sub
   f32.mul
   f32.add
   f32.store
   local.get $9
   i32.const 463872
   i32.add
   local.get $4
   f32.const 2
   local.get $12
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $1
   f32.mul
   local.get $2
   f32.const 1
   local.get $1
   f32.sub
   f32.mul
   f32.add
   f32.store
   local.get $9
   i32.const 513024
   i32.add
   local.get $4
   f32.const 2
   local.get $7
   f32.convert_i32_s
   f32.const 1
   f32.add
   f32.div
   local.tee $1
   f32.mul
   local.get $3
   f32.const 1
   local.get $1
   f32.sub
   f32.mul
   f32.add
   f32.store
  end
  i32.const 1120
  f32.load
  local.tee $1
  f32.const 2
  local.get $1
  f32.const 0.10000000149011612
  f32.gt
  select
  local.set $1
  local.get $6
  i32.const 2
  i32.shl
  local.tee $9
  i32.const 267264
  i32.add
  f32.load
  local.set $2
  local.get $6
  local.get $6
  i32.const 20
  i32.const 1116
  i32.load
  local.tee $7
  local.get $7
  i32.const 2
  i32.le_s
  select
  i32.sub
  i32.const 1
  i32.add
  local.tee $7
  i32.const 0
  local.get $7
  i32.const 0
  i32.gt_s
  select
  local.tee $7
  i32.sub
  i32.const 1
  i32.add
  local.set $10
  f64.const 0
  local.set $0
  loop $for-loop|0
   local.get $6
   local.get $7
   i32.ge_s
   if
    local.get $0
    local.get $7
    i32.const 2
    i32.shl
    i32.const 267264
    i32.add
    f32.load
    f64.promote_f32
    local.tee $16
    f64.add
    local.set $0
    local.get $8
    local.get $16
    local.get $16
    f64.mul
    f64.add
    local.set $8
    local.get $7
    i32.const 1
    i32.add
    local.set $7
    br $for-loop|0
   end
  end
  local.get $9
  i32.const 562176
  i32.add
  local.get $0
  local.get $10
  f64.convert_i32_s
  local.tee $0
  f64.div
  local.tee $16
  local.get $8
  local.get $0
  f64.div
  local.get $16
  local.get $16
  f64.mul
  f64.sub
  f64.const 0
  f64.max
  f64.sqrt
  local.get $1
  f64.promote_f32
  f64.mul
  local.tee $0
  f64.add
  f32.demote_f64
  f32.store
  local.get $9
  i32.const 611328
  i32.add
  local.get $16
  local.get $0
  f64.sub
  f32.demote_f64
  f32.store
  local.get $6
  if
   global.get $assembly/engine/rsiStateIdx
   local.get $6
   i32.eq
   local.get $6
   i32.const 14
   i32.gt_s
   i32.and
   if
    global.get $assembly/engine/rsiBaseGain
    f64.const 13
    f64.mul
    local.get $2
    local.get $6
    i32.const 2
    i32.shl
    i32.const 267260
    i32.add
    f32.load
    f32.sub
    f64.promote_f32
    local.tee $0
    f64.const 0
    local.get $0
    f64.const 0
    f64.gt
    select
    f64.add
    f64.const 14
    f64.div
    global.set $assembly/engine/rsiCurGain
    global.get $assembly/engine/rsiBaseLoss
    f64.const 13
    f64.mul
    local.get $0
    f64.neg
    f64.const 0
    local.get $0
    f64.const 0
    f64.lt
    select
    f64.add
    f64.const 14
    f64.div
    global.set $assembly/engine/rsiCurLoss
    local.get $9
    i32.const 660480
    i32.add
    block $assembly/engine/rsiFromAvg|inlined.0 (result f32)
     f32.const 100
     f32.const 50
     global.get $assembly/engine/rsiCurGain
     local.tee $0
     f64.const 1e-09
     f64.gt
     select
     global.get $assembly/engine/rsiCurLoss
     local.tee $8
     f64.const 1e-09
     f64.lt
     br_if $assembly/engine/rsiFromAvg|inlined.0
     drop
     f64.const 100
     f64.const 100
     local.get $0
     local.get $8
     f64.div
     f64.const 1
     f64.add
     f64.div
     f64.sub
     f32.demote_f64
    end
    f32.store
   else
    f64.const 0
    local.set $0
    f64.const 0
    local.set $8
    local.get $6
    i32.const 14
    local.get $6
    local.get $6
    i32.const 14
    i32.ge_s
    select
    local.tee $10
    i32.sub
    i32.const 1
    i32.add
    local.set $7
    loop $for-loop|1
     local.get $6
     local.get $7
     i32.ge_s
     if
      local.get $7
      i32.const 2
      i32.shl
      local.tee $11
      i32.const 267264
      i32.add
      f32.load
      local.get $11
      i32.const 267260
      i32.add
      f32.load
      f32.sub
      f64.promote_f32
      local.tee $16
      f64.const 0
      f64.gt
      if
       local.get $0
       local.get $16
       f64.add
       local.set $0
      else
       local.get $8
       local.get $16
       f64.sub
       local.set $8
      end
      local.get $7
      i32.const 1
      i32.add
      local.set $7
      br $for-loop|1
     end
    end
    local.get $0
    local.get $10
    f64.convert_i32_s
    local.tee $0
    f64.div
    local.tee $16
    global.set $assembly/engine/rsiCurGain
    local.get $8
    local.get $0
    f64.div
    local.tee $0
    global.set $assembly/engine/rsiCurLoss
    local.get $6
    global.set $assembly/engine/rsiStateIdx
    local.get $9
    i32.const 660480
    i32.add
    local.get $0
    f64.const 1e-09
    f64.lt
    if (result f32)
     f32.const 100
     f32.const 50
     local.get $16
     f64.const 1e-09
     f64.gt
     select
    else
     f64.const 100
     f64.const 100
     local.get $16
     local.get $0
     f64.div
     f64.const 1
     f64.add
     f64.div
     f64.sub
     f32.demote_f64
    end
    f32.store
   end
  else
   i32.const 660480
   f32.const 50
   f32.store
   f64.const 0
   global.set $assembly/engine/rsiBaseGain
   f64.const 0
   global.set $assembly/engine/rsiBaseLoss
   f64.const 0
   global.set $assembly/engine/rsiCurGain
   f64.const 0
   global.set $assembly/engine/rsiCurLoss
   i32.const 0
   global.set $assembly/engine/rsiStateIdx
  end
  i32.const 1024
  local.get $6
  i32.const 1
  i32.add
  local.tee $6
  i32.store
  local.get $6
 )
 (func $assembly/arena/secure_wipe
  i32.const 1024
  i32.const 0
  i32.const 989952
  memory.fill
  i32.const 5120
  global.set $assembly/arena/Arena.current
 )
)
