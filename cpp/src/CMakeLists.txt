#----------------------------------------------------------#
#                                                    
#             CMake makefile generation file 
#
#----------------------------------------------------------#

CMAKE_MINIMUM_REQUIRED( VERSION 2.6 )

PROJECT( HONEY_MUMMIES )

OPTION( BUILD_TESTS "Build test directories."                     True )
OPTION( BUILD_DEBUG "Build debug preprocessor define statements." True )

MESSAGE( "OPTIONS:" )
MESSAGE( "     -BUILD_TESTS: ${BUILD_TESTS}" )
MESSAGE( "     -BUILD_DEBUG: ${BUILD_DEBUG}" )

##
# Add define macro
MACRO( ADD_DEF DEF )
  IF( WIN32 )
    ADD_DEFINITIONS( "/D${DEF}" )
    MESSAGE( STATUS "Adding definition /D${DEF}" )
  ELSE()
    ADD_DEFINITIONS( "-D${DEF}" )
    MESSAGE( STATUS "Adding definition -D${DEF}" )
  ENDIF()
ENDMACRO( ADD_DEF )

###
# Add CXX Flags
SET( CMAKE_CXX_FLAGS
     "${CMAKE_CXX_FLAGS} -std=c++0x" )

###
# If for building testing framework
IF( BUILD_TESTS )
    ENABLE_TESTING()
ENDIF( BUILD_TESTS )

###
# If for building with debug preprocessor define statements
IF( BUILD_DEBUG )
    ADD_DEF( "Debug" )
ENDIF( BUILD_DEBUG )

###
# External Includes
#SET( EIGEN_INCLUDE_DIR 
#     ${HONEY_MUMMIES_SOURCE_DIR}/EXTERNALS/Eigen/eigen-eigen-ca142d0540d3 )
#
#MESSAGE( STATUS "EIGEN_INCLUDE_DIR...${EIGEN_INCLUDE_DIR}" )

###
# HONEY_MUMMIES Includes
SET( EXECS
     ${HONEY_MUMMIES_SOURCE_DIR}/Execs )
SET( ENGINE
     ${HONEY_MUMMIES_SOURCE_DIR}/Engine )
SET( OBJECTS
     ${HONEY_MUMMIES_SOURCE_DIR}/Objects )

###
# Final includes
INCLUDE_DIRECTORIES( ${EXECS}
                     ${ENGINE}
                     ${OBJECTS} )

ADD_SUBDIRECTORY( Execs )
ADD_SUBDIRECTORY( Engine )
ADD_SUBDIRECTORY( Objects )
