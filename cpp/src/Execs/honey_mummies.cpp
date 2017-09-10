#include "honey_mummies_engine.h"

int main( void )
{
  HoneyMummies::HoneyMummiesEng * engine = new HoneyMummies::HoneyMummiesEng;
  engine->run();
  delete engine;
  return 0;  
}
