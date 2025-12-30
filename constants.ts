import { MapTeam } from './types';

// Helper to create reliable data
const createTeam = (
    id: string, number: string, name: string, location: string, 
    lat: number, lng: number, desc: string, awards: string[] = [],
    website?: string,
    logoPath?: string
): MapTeam => ({
    id, number, name, location, description: desc,
    coordinates: { lat, lng },
    awards,
    website,
    logo: logoPath
});

// Helper for small random coordinate offsets so markers don't overlap exactly
const offset = (coord: number) => coord + (Math.random() - 0.5) * 0.05;

export const INITIAL_TEAMS: MapTeam[] = [
  // --- KAZAKHSTAN (User Provided) ---
  createTeam('kz-1', '24697', 'SANA Team', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'Almaty BIL for boys. 3 years in FIRST; qualified for Houston 24-25.', ['Inspire', 'Connect'], 'instagram.com/sana_ftc', '/logos/sana.jpg'),
  createTeam('kz-2', '25109', 'Naizagay', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'Harmony STEAM. Team exists for about 3 years.', ['Motivate'], 'instagram.com/naizagay_ftc', '/logos/naizagay.jpg'),
  createTeam('kz-3', '19163', 'MLP', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'Prometheus School. 2nd year in FTC, team of 4.', ['Mentoring'], 'instagram.com/mlp.ftc', '/logos/mlp.jpg'),
  createTeam('kz-4', '25034', 'OZGE', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'Astana Polytech. 3 years in FIRST, technically strong.', ['Innovate'], 'instagram.com/ozge.ftc', '/logos/ozge.jpg'),
  createTeam('kz-5', 'KZ-RUMBLE', 'Rumble', 'Zhanaozen, Kazakhstan', offset(43.3409), offset(52.8598), 'BIL. First year in FTC (previously FLL).', ['Rookie'], 'instagram.com/rumble_ftc_fll', '/logos/rumble.jpg'),
  createTeam('kz-6', '32535', 'OYU', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), '119 Lyceum. Previously FLL, first time joined FTC.', ['Rookie'], 'instagram.com/oyu.ftc', '/logos/oyu.jpg'),
  createTeam('kz-7', '28836', 'Zenith', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'Astana BIL. First year in FTC, confident in robot.', ['Design'], 'instagram.com/zenith_ftc', '/logos/zenith.jpg'),
  createTeam('kz-8', '28888', 'ERRORDA', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'Nurorda Almaty. First year in FTC, actively learning.', ['Think'], 'instagram.com/errorda.ftc', '/logos/errorda.jpg'),
  createTeam('kz-9', '24690', 'Azumi', 'Oral, Kazakhstan', offset(51.2333), offset(51.3667), 'NIS Oral. First year in FTC, improving Inspire.', ['Inspire'], 'instagram.com/azumi_ftc', '/logos/azumi.jpg'),
  createTeam('kz-10', '33595', 'Tolqyn', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), '103 Comfort School. Less than 2 months old.', ['Rookie'], 'instagram.com/tolqyn_ftc', '/logos/tolqyn.jpg'),
  createTeam('kz-11', '29382', 'Flying Penguins', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'International Steppe School. Founded in off-season 2025.', ['Connect'], 'instagram.com/flyingpenguins_ftc', '/logos/flyingpenguins.jpg'),
  createTeam('kz-12', '31881', 'Qazaq Style Juniors', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'School #97 & #62. Inspire Award 1st Place.', ['Inspire', 'Think'], 'instagram.com/qazaqstyle.juniors', '/logos/qazaqsrylejuniors.jpg'),
  createTeam('kz-13', '33785', 'UnionTUR', 'Kazygurt, Turkestan', offset(41.7589), offset(69.4124), 'Combined team from 3 schools.', ['Innovate'], 'instagram.com/uniontur_ftc', '/logos/uniontur.jpg'),
  createTeam('kz-14', '33527', 'SunRise', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), '178 SL. New team opened this year.', ['Rookie'], 'instagram.com/ftc_sunrise', '/logos/sunrise.jpg'),
  createTeam('kz-15', '29029', 'Foxslide', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'RFMSH Astana. Participating in DECODE season.', ['Motivate'], 'instagram.com/foxslide.ftc', '/logos/foxslide.jpg'),
  createTeam('kz-16', '33444', 'Uly Dala', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'Gymnasium #140. Control Award winners.', ['Control', 'Inspire'], 'instagram.com/ulydala.ftc', '/logos/ulydala.jpg'),
  createTeam('kz-17', '33800', 'Gammadive', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'School-Gymnasium #94. One month old.', ['Design'], 'instagram.com/gammadive_ftc', '/logos/gamma drive.jpg'),
  createTeam('kz-18', '28473', 'SlapSeals', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'Binom School. One year old, strong team spirit.', ['Motivate'], 'instagram.com/slapseals_ftc', '/logos/slapseals.jpg'),
  createTeam('kz-19', '25054', 'IRYS', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'KazGU Bekzat. Formed from 3 teams.', ['Connect'], 'instagram.com/irys_ftc', '/logos/irys.jpg'),
  createTeam('kz-20', '25547', 'SPIRIT', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'Schoolchildrens Palace. 2nd season, 8 members.', ['Connect'], 'instagram.com/spirit_ftc', '/logos/spirit.jpg'),
  createTeam('kz-21', '33470', 'Sakura', 'Atyrau, Kazakhstan', offset(47.1127), offset(51.8869), 'Farabi Intl & NIS. Built holonomic drive.', ['Innovate'], 'instagram.com/sakura_ftc', '/logos/sakura.jpg'),
  createTeam('kz-22', '27772', 'JelToqSun', 'Karaganda, Kazakhstan', offset(49.8020), offset(73.1021), 'Murager. In FIRST since Superpowered.', ['Inspire'], 'instagram.com/first.jeltoqsun', '/logos/jeltoqsan.jpg'),
  createTeam('kz-23', '30326', 'Future Vortex', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'Gymnasium #97 & #218. Formed this season.', ['Think'], 'instagram.com/future._vortexftckz', '/logos/futurevortex.jpg'),
  createTeam('kz-24', '26602', 'WATER 7', 'Taldykorgan, Kazakhstan', offset(45.0115), offset(78.3770), 'Zhylandy Lyceum. Second year participating in FTC.', ['Design'], 'instagram.com/team.water7', '/logos/water7.jpg'),
  createTeam('kz-25', '32685', 'FiftyOne Teams', 'Semey, Kazakhstan', offset(50.4111), offset(80.2275), '51 Keleshek School. Recently opened.', ['Design'], 'instagram.com/fifty1teams_semey_ftc', '/logos/fiftyone.jpg'),
  createTeam('kz-26', '21058', 'Panheya', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'NIS Almaty-Medeu. Founded by ex-Cristabol members.', ['Inspire'], 'instagram.com/ftc_panheya', '/logos/panheya.jpg'),
  createTeam('kz-27', '22975', 'BILORDA', 'Astana, Kazakhstan', offset(51.1694), offset(71.4491), 'Nurorda. Team exists for 4 years.', ['Control'], 'instagram.com/bilorda.ftc', '/logos/bilorda.jpg'),
  createTeam('kz-28', '33033', 'Espada', 'Almaty, Kazakhstan', offset(43.2551), offset(76.9126), 'Almaty Multidisciplinary College. Rookie team.', ['Rookie'], 'instagram.com/amk_robotics', '/logos/espada.jpg'),
  createTeam('kz-29', '33624', 'STRIKE', 'Shymkent, Kazakhstan', offset(42.3417), offset(69.5901), 'NIS Karatau. New FTC team.', ['Rookie'], 'instagram.com/strike_ftc'),

  // --- USA (East) ---
  createTeam('1', '11115', 'Gluten Free', 'New Hampshire, USA', 43.1939, -71.5724, 'Legendary World Championship winning team.', ['Inspire', 'Winning Alliance'], 'glutenfree11115.com'),
  createTeam('2', '18438', 'Wolfpack Machina', 'Beverly, MA, USA', 42.5584, -70.8800, 'High-performance team.', ['Control Award'], 'wolfpackmachina.com'),
  createTeam('3', '16633', 'Don\'t Blink', 'Plainsboro, NJ, USA', 40.3303, -74.6300, 'Consistently competitive team.', ['Motivate'], 'dontblinkrobotics.org'),
  createTeam('4', '4174', 'Atomic Theory', 'New York, NY, USA', 40.7128, -74.0060, 'Long-standing NYC powerhouse team.', ['Connect'], 'atomictheory.org'),
  createTeam('5', '13917', 'CyberScott', 'Scotland, PA, USA', 39.9550, -77.5850, 'Strong innovative designs.', ['Design'], 'cyberscott.org'),

  // --- USA (Midwest/West) ---
  createTeam('6', '8680', 'Kraken-Pinion', 'Mequon, WI, USA', 43.2250, -87.9890, 'Known for "Kraken" branding.', ['Innovate'], 'kp-robotics.org'),
  createTeam('7', '7238', 'Cyborg Cats', 'St. Louis, MO, USA', 38.6270, -90.1994, 'Documentation experts.', ['Think'], 'cyborgcats.com'),
  createTeam('8', '11212', 'The Clueless', 'San Diego, CA, USA', 32.7157, -117.1611, 'Top-tier California team.', ['Inspire'], 'theclueless.org'),
  createTeam('9', '12635', 'Kuriosity Robotics', 'Palo Alto, CA, USA', 37.4419, -122.1430, 'Silicon Valley based team.', ['Control'], 'kuriosityrobotics.org'),
  createTeam('10', '14374', 'Dark Matter', 'Mandeville, LA, USA', 30.3582, -90.0656, 'Strong southern team.', ['Motivate'], 'darkmatterrobotics.org'),

  // --- International (Sample) ---
  createTeam('11', '19066', 'Spice', 'Bucharest, Romania', 44.4268, 26.1025, 'Strongest international contenders.', ['Winning Alliance'], 'spicerobotics.ro'),
  createTeam('16', '16008', 'RoboLancers', 'Stuttgart, Germany', 48.7758, 9.1829, 'Veteran German team.', ['Design'], 'robolancers.de'),
  createTeam('21', '5985', 'Project Bucephalus', 'Wollongong, Australia', -34.4248, 150.8931, 'Australia\'s premier team.', ['Inspire'], 'projectbucephalus.org'),
  createTeam('26', '16378', 'Pink to the Future', 'Eindhoven, Netherlands', 51.4416, 5.4697, 'Vibrant pink branding.', ['Connect'], 'pinktothefuture.nl'),
  createTeam('31', '16168', 'Team Elev8', 'Mumbai, India', 19.0760, 72.8777, 'Top contender from India.', ['Inspire'], 'teamelev8.in'),
  createTeam('46', '13504', 'Taipei American School', 'Taipei, Taiwan', 25.1146, 121.5298, 'Well-resourced technical team.', ['Inspire'], 'tas.edu.tw'),
];