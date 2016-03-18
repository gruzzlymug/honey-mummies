FILE( GLOB H_F "*.h" )
FILE( GLOB HPP_F "*.hpp" )
FILE( GLOB CPP_F "*.cpp" )

ADD_LIBRARY( EXECS ${H_F} ${HPP_F} ${CPP_F} )
SET_TARGET_PROPERTIES( EXECS PROPERTIES LINKER_LANGUAGE CXX )
TARGET_LINK_LIBRARIES( EXECS
                       ENGINE
                       OBJECTS )

INSTALL( TARGETS EXECS
         RUNTIME DESTINATION bin 
         LIBRARY DESTINATION lib
         ARCHIVE DESTINATION lib )

MESSAGE( "EXECS LIB: ${EXECS}" )

IF( BUILD_TESTS )

   #### Example Unit Test exec add
   #ADD_EXECUTABLE( test_example tests/test_example.cpp )
   #TARGET_LINK_LIBRARIES( test_example HOTEL )
   #INSTALL( TARGETS test_example
   #         DESTINATION test )
   #ADD_TEST( test_example test_example )

ENDIF( BUILD_TESTS )

ADD_EXECUTABLE( honey_mummies honey_mummies.cpp )
TARGET_LINK_LIBRARIES( honey_mummies EXECS )
INSTALL( TARGETS honey_mummies
         DESTINATION bin )

INCLUDE_DIRECTORIES( . )
