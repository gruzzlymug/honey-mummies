FILE( GLOB H_F "*.h" )
FILE( GLOB HPP_F "*.hpp" )
FILE( GLOB CPP_F "*.cpp" )

ADD_LIBRARY( OBJECTS ${H_F} ${HPP_F} ${CPP_F} )
SET_TARGET_PROPERTIES( OBJECTS PROPERTIES LINKER_LANGUAGE CXX )
TARGET_LINK_LIBRARIES( OBJECTS
                       ENGINE
                       EXECS )

INSTALL( TARGETS OBJECTS
         RUNTIME DESTINATION bin 
         LIBRARY DESTINATION lib
         ARCHIVE DESTINATION lib )

MESSAGE( "OBJECTS LIB: ${OBJECTS}" )

IF( BUILD_TESTS )

   #### Example Unit Test exec add
   #ADD_EXECUTABLE( test_example tests/test_example.cpp )
   #TARGET_LINK_LIBRARIES( test_example HOTEL )
   #INSTALL( TARGETS test_example
   #         DESTINATION test )
   #ADD_TEST( test_example test_example )

ENDIF( BUILD_TESTS )
INCLUDE_DIRECTORIES( . )
