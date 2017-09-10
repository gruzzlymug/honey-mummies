FILE( GLOB H_F "*.h" )
FILE( GLOB HPP_F "*.hpp" )
FILE( GLOB CPP_F "*.cpp" )

ADD_LIBRARY( ENGINE ${H_F} ${HPP_F} ${CPP_F} )
SET_TARGET_PROPERTIES( ENGINE PROPERTIES LINKER_LANGUAGE CXX )
TARGET_LINK_LIBRARIES( ENGINE
                       EXECS
                       OBJECTS )

INSTALL( TARGETS ENGINE
         RUNTIME DESTINATION bin 
         LIBRARY DESTINATION lib
         ARCHIVE DESTINATION lib )

MESSAGE( "ENGINE LIB: ${ENGINE}" )

IF( BUILD_TESTS )

   #### Example Unit Test exec add
   #ADD_EXECUTABLE( test_example tests/test_example.cpp )
   #TARGET_LINK_LIBRARIES( test_example HOTEL )
   #INSTALL( TARGETS test_example
   #         DESTINATION test )
   #ADD_TEST( test_example test_example )

ENDIF( BUILD_TESTS )
INCLUDE_DIRECTORIES( . )
