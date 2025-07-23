# Common subject codes across multiple programs
common_subject_codes = [
    "MATH 101", "PHYS 101", "CHEM 101", "COMP 102", "ENGG 111", "ENGG 101", "EDRG 101",
    "MATH 104", "PHYS 102", "ENGG 112", "ENGT 105", "COMP 116", "ENVE 101", "EDRG 102", "ENGG 102",
    "MATH 207", "MATH 208", "MCSC 202", "MGTS 301", "MGTS 402", "MGTS 403"
]

# Mechanical Engineering unique subject codes
mecheng_subject_codes = [
    "MEEG 112", "MEEG 217", "MEEG 216", "MEEG 213", "EEEG 204", "MEEG 219", "MEEG 210",
    "MEEG 211", "MEEG 207", "MEEG 202", "MEEG 206", "MEEG 215", "MEEG 212", "COEG 304",
    "MEEG 303", "MEEG 325", "MEEG 315", "MEEG 312", "MEEG 305", "MEEG 317", "MEEG 306",
    "MEEG 308", "MEEG 318", "MGTS 303", "MEEG 313", "MEEG 311", "MEPP 408", "MEPP 403",
    "MEPP 412", "MEEG 404", "MEEG 406", "MEEG 434", "MEEG 417"
]

# Computer Engineering unique subject codes
compeng_subject_codes = [
    "MCSC 201", "EEEG 202", "EEEG 211", "COMP 202", "COMP 206", "EEEG 217",
    "COMP 204", "COMP 231", "COMP 232", "COMP 207", "COMP 307", "COMP 315", "COEG 304",
    "COMP 310", "COMP 303", "COMP 301", "COMP 304", "COMP 302", "COMP 342", "COMP 314",
    "COMP 306", "COMP 343", "COMP 308", "COMP 401", "COMP 472", "COMP 409", "COMP 407", "COMP 408"
]

# Communication Engineering unique subject codes
commeng_subject_codes = [
    "EEEG 207", "EEEG 213", "EEEG 218", "EEEG 205", "EEEG 214", "EEEG 221", "EEEG 215",
    "EEEG 219", "EEEG 222", "EEEG 212", "EEEG 309", "EEEG 314", "EPEG 317", "ETEG 320",
    "EEEG 306", "ETEG 322", "ETEG 313", "EPEG 301", "EEEG 320", "ETEG 303", "ETEG 321",
    "ETEG 305", "ETEG 323", "EEEG 321", "ETEG 319", "ETEG 402", "ETEG 408", "ETEG 422",
    "ETEG 403", "ETEG 419", "ETEG 417"
]

# Power & Control Engineering unique subject codes
powerctrl_subject_codes = [
    "EEEG 207", "EEEG 213", "EEEG 218", "EEEG 205", "EEEG 214", "EEEG 221", "EEEG 215",
    "EEEG 219", "EEEG 222", "EEEG 212", "EEEG 309", "EEEG 314", "EPEG 302", "EPEG 317",
    "EEEG 306", "EPEG 307", "PCEG 313", "ETEG 301", "COEG 301", "EPEG 315", "EPEG 318",
    "PCEG 308", "PCEG 319", "ETEG 402", "ETEG 408", "ETEG 422", "ETEG 403", "ETEG 419", "ETEG 417"
]

# Combined full list without duplicates
TAGS = (
    common_subject_codes +
    mecheng_subject_codes +
    compeng_subject_codes +
    commeng_subject_codes +
    powerctrl_subject_codes
)